/**
 * A tiny, dependency-free, no-eval template engine.
 *
 * Supported syntax (Handlebars-flavoured subset):
 *
 *   {{ name }}                      interpolate a value
 *   {{ this }}  {{ . }}             current item inside #each
 *   {{ @index }} {{ @first }} {{ @last }}   loop metadata
 *
 *   {{#if name}} ... {{else}} ... {{/if}}
 *   {{#if name == "x"}} ... {{/if}}        equality (also !=)
 *   {{#unless name}} ... {{/unless}}
 *   {{#each list}} ... {{/each}}
 *
 * Truthiness: non-empty string, true, non-empty array, non-zero number.
 * Arrays interpolate as a comma-separated list. For `name == "x"` where
 * `name` is an array, the test passes if the array includes "x".
 */

type Scope = Record<string, unknown>;

type Node =
  | { kind: "text"; value: string }
  | { kind: "var"; expr: string }
  | { kind: "if"; cond: Condition; body: Node[]; alt: Node[] }
  | { kind: "unless"; cond: Condition; body: Node[] }
  | { kind: "each"; name: string; body: Node[] };

interface Condition {
  lhs: string;
  op?: "==" | "!=";
  rhs?: string;
}

const TAG = /\{\{([^}]+)\}\}/g;

interface Token {
  text?: string;
  tag?: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(input))) {
    if (m.index > last) tokens.push({ text: input.slice(last, m.index) });
    tokens.push({ tag: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < input.length) tokens.push({ text: input.slice(last) });
  return tokens;
}

function parseCondition(raw: string): Condition {
  const eq = raw.match(/^(.+?)\s*(==|!=)\s*(.+)$/);
  if (!eq) return { lhs: raw.trim() };
  const rhs = eq[3].trim().replace(/^["']|["']$/g, "");
  return { lhs: eq[1].trim(), op: eq[2] as "==" | "!=", rhs };
}

function parse(tokens: Token[]): Node[] {
  let pos = 0;

  function walk(stopTags: string[]): { nodes: Node[]; stoppedAt: string } {
    const nodes: Node[] = [];
    while (pos < tokens.length) {
      const tok = tokens[pos];
      if (tok.text !== undefined) {
        nodes.push({ kind: "text", value: tok.text });
        pos++;
        continue;
      }
      const tag = tok.tag as string;
      if (stopTags.includes(tag)) {
        pos++;
        return { nodes, stoppedAt: tag };
      }
      pos++;
      if (tag.startsWith("#if ")) {
        const cond = parseCondition(tag.slice(4));
        const first = walk(["else", "/if"]);
        let alt: Node[] = [];
        if (first.stoppedAt === "else") alt = walk(["/if"]).nodes;
        nodes.push({ kind: "if", cond, body: first.nodes, alt });
      } else if (tag.startsWith("#unless ")) {
        const cond = parseCondition(tag.slice(8));
        const inner = walk(["/unless"]);
        nodes.push({ kind: "unless", cond, body: inner.nodes });
      } else if (tag.startsWith("#each ")) {
        const name = tag.slice(6).trim();
        const inner = walk(["/each"]);
        nodes.push({ kind: "each", name, body: inner.nodes });
      } else {
        nodes.push({ kind: "var", expr: tag });
      }
    }
    return { nodes, stoppedAt: "" };
  }

  return walk([]).nodes;
}

function resolve(name: string, stack: Scope[]): unknown {
  const trimmed = name.trim();
  if (trimmed === "this" || trimmed === ".") {
    for (let i = stack.length - 1; i >= 0; i--) {
      if ("this" in stack[i]) return stack[i].this;
    }
    return undefined;
  }
  for (let i = stack.length - 1; i >= 0; i--) {
    if (trimmed in stack[i]) return stack[i][trimmed];
  }
  return undefined;
}

function truthy(v: unknown): boolean {
  if (v === true) return true;
  if (v === false || v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return v !== 0;
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
}

function stringify(v: unknown): string {
  if (v == null || v === false) return "";
  if (v === true) return "";
  if (Array.isArray(v)) return v.filter(Boolean).join(", ");
  return String(v);
}

function evalCondition(cond: Condition, stack: Scope[]): boolean {
  const lhs = resolve(cond.lhs, stack);
  if (!cond.op) return truthy(lhs);
  const matches = Array.isArray(lhs)
    ? lhs.map(String).includes(cond.rhs as string)
    : stringify(lhs) === cond.rhs;
  return cond.op === "==" ? matches : !matches;
}

function render(nodes: Node[], stack: Scope[]): string {
  let out = "";
  for (const node of nodes) {
    switch (node.kind) {
      case "text":
        out += node.value;
        break;
      case "var":
        out += stringify(resolve(node.expr, stack));
        break;
      case "if":
        out += evalCondition(node.cond, stack)
          ? render(node.body, stack)
          : render(node.alt, stack);
        break;
      case "unless":
        if (!evalCondition(node.cond, stack)) out += render(node.body, stack);
        break;
      case "each": {
        const list = resolve(node.name, stack);
        if (!Array.isArray(list)) break;
        list.forEach((item, i) => {
          out += render(node.body, [
            ...stack,
            {
              this: item,
              "@index": i,
              "@first": i === 0,
              "@last": i === list.length - 1,
            },
          ]);
        });
        break;
      }
    }
  }
  return out;
}

/** Collapse runaway blank lines left behind by conditional blocks. */
function tidy(s: string): string {
  return s
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function renderTemplate(
  template: string,
  context: Record<string, unknown>,
): string {
  const ast = parse(tokenize(template));
  return tidy(render(ast, [context]));
}
