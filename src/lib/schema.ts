/**
 * Data schema shared by JSON content files, the server loaders and the UI.
 *
 * Content lives entirely in /data as JSON. Nothing here is hard-coded per
 * category — adding a category or generator type is a pure data change.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multi-select"
  | "toggle";

export interface FieldOption {
  id: string;
  label: string;
  /** Optional grouping header shown in the UI (e.g. "Frontend"). */
  group?: string;
  description?: string;
}

export interface Field {
  /** Key the value is exposed under in the template context. */
  id: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  /** Name of a shared pool in /data/options/<ref>.json. */
  optionsRef?: string;
  /** Inline options, used when optionsRef is not set. */
  options?: FieldOption[];
  default?: string | string[] | boolean;
}

export interface GeneratorType {
  id: string;
  label: string;
  description: string;
  /** lucide-react icon name. */
  icon?: string;
  fields: Field[];
  /** Conditional-block template — see src/lib/template.ts. */
  template: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  /** lucide-react icon name. */
  icon?: string;
  /** Tailwind color token used for accents, e.g. "violet". */
  accent?: string;
}

/** A generator with all optionsRef pools inlined by the loader. */
export interface ResolvedField extends Omit<Field, "optionsRef"> {
  options?: FieldOption[];
}

export interface ResolvedGenerator
  extends Omit<GeneratorType, "fields"> {
  category: string;
  fields: ResolvedField[];
}

/** Value map passed to the template engine: field id -> rendered value. */
export type PromptContext = Record<
  string,
  string | string[] | boolean | undefined
>;
