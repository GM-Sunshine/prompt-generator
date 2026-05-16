import { describe, it, expect } from "vitest";
import { renderTemplate } from "./template";

describe("renderTemplate", () => {
  it("interpolates scalars", () => {
    expect(renderTemplate("Hi {{name}}", { name: "Ada" })).toBe("Hi Ada");
  });

  it("joins array values with commas", () => {
    expect(
      renderTemplate("Stack: {{stack}}", { stack: ["Next.js", "Postgres"] }),
    ).toBe("Stack: Next.js, Postgres");
  });

  it("omits booleans and missing values", () => {
    expect(renderTemplate("a{{flag}}b{{missing}}c", { flag: true })).toBe(
      "abc",
    );
  });

  it("handles #if / #else by truthiness", () => {
    const t = "{{#if x}}has{{else}}none{{/if}}";
    expect(renderTemplate(t, { x: "y" })).toBe("has");
    expect(renderTemplate(t, { x: "" })).toBe("none");
    expect(renderTemplate(t, { x: [] })).toBe("none");
  });

  it("handles equality and inequality", () => {
    expect(
      renderTemplate('{{#if env == "prod"}}LIVE{{/if}}', { env: "prod" }),
    ).toBe("LIVE");
    expect(
      renderTemplate('{{#if env != "prod"}}SAFE{{/if}}', { env: "dev" }),
    ).toBe("SAFE");
  });

  it("treats array == as includes()", () => {
    expect(
      renderTemplate('{{#if fw == "React"}}react!{{/if}}', {
        fw: ["React", "Vue"],
      }),
    ).toBe("react!");
  });

  it("supports #unless", () => {
    expect(
      renderTemplate("{{#unless tests}}no tests{{/unless}}", { tests: false }),
    ).toBe("no tests");
  });

  it("iterates with #each and loop metadata", () => {
    const t = "{{#each items}}{{@index}}:{{this}}{{#unless @last}}, {{/unless}}{{/each}}";
    expect(renderTemplate(t, { items: ["a", "b", "c"] })).toBe(
      "0:a, 1:b, 2:c",
    );
  });

  it("nests conditionals inside loops", () => {
    const t =
      "{{#each xs}}{{#if @first}}START {{/if}}{{this}} {{/each}}";
    expect(renderTemplate(t, { xs: ["one", "two"] })).toBe(
      "START one two",
    );
  });

  it("tidies blank lines from stripped blocks", () => {
    const t = "Line1\n{{#if no}}\nhidden\n{{/if}}\n\n\nLine2";
    expect(renderTemplate(t, { no: false })).toBe("Line1\n\nLine2");
  });
});
