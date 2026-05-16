/**
 * Formats one rendered prompt into model-specific variants. No network
 * calls — this only reshapes text for how each tool likes to be prompted.
 */

export type TargetId =
  | "plain"
  | "chatgpt"
  | "xml"
  | "cursor"
  | "system";

export interface ExportTarget {
  id: TargetId;
  label: string;
  description: string;
}

export const EXPORT_TARGETS: ExportTarget[] = [
  { id: "plain", label: "Plain", description: "The raw prompt, unchanged." },
  {
    id: "chatgpt",
    label: "ChatGPT",
    description: "Light framing + Markdown output instruction.",
  },
  {
    id: "xml",
    label: "XML / Structured",
    description: "Wrapped in semantic XML tags many models follow closely.",
  },
  {
    id: "cursor",
    label: "Cursor",
    description: "Concise, action-first phrasing for in-editor agents.",
  },
  {
    id: "system",
    label: "System + User",
    description: "Split into a system prompt and a user message.",
  },
];

function formatXml(prompt: string, title: string): string {
  return [
    "<task>",
    title ? `<objective>${title}</objective>` : null,
    "<instructions>",
    prompt,
    "</instructions>",
    "<output_format>",
    "Think briefly about your approach, then produce the deliverables. Use clear Markdown.",
    "</output_format>",
    "</task>",
  ]
    .filter(Boolean)
    .join("\n");
}

function formatChatGPT(prompt: string): string {
  return `${prompt}\n\n---\nRespond in well-structured Markdown. State key assumptions instead of asking unless a requirement is genuinely blocking.`;
}

function formatCursor(prompt: string): string {
  return [
    "# Task",
    "",
    prompt,
    "",
    "Apply the changes directly in the codebase. Keep edits minimal and consistent with existing conventions. Run/verify where possible before finishing.",
  ].join("\n");
}

function formatSystemUser(
  prompt: string,
  title: string,
): string {
  return [
    "### SYSTEM",
    "You are a careful, senior expert. Follow the task exactly, make well-reasoned default decisions, and produce complete, usable deliverables.",
    "",
    "### USER",
    title ? `${title}\n` : "",
    prompt,
  ]
    .filter((s) => s !== "")
    .join("\n");
}

export function formatPrompt(
  target: TargetId,
  prompt: string,
  title = "",
): string {
  switch (target) {
    case "xml":
      return formatXml(prompt, title);
    case "chatgpt":
      return formatChatGPT(prompt);
    case "cursor":
      return formatCursor(prompt);
    case "system":
      return formatSystemUser(prompt, title);
    case "plain":
    default:
      return prompt;
  }
}
