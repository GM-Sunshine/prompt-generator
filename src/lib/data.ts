/**
 * Server-only content loaders. All app content is JSON under /data:
 *
 *   data/categories.json
 *   data/options/<ref>.json          shared option pools
 *   data/generators/<category>.json   generator types per category
 *
 * Generators are returned with every `optionsRef` inlined so the UI and
 * template layer never touch the filesystem.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Category,
  FieldOption,
  GeneratorType,
  ResolvedField,
  ResolvedGenerator,
} from "./schema";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(...segments: string[]): T {
  return JSON.parse(readFileSync(join(DATA_DIR, ...segments), "utf8")) as T;
}

const optionCache = new Map<string, FieldOption[]>();

function loadOptions(ref: string): FieldOption[] {
  const cached = optionCache.get(ref);
  if (cached) return cached;
  let opts: FieldOption[] = [];
  try {
    opts = readJson<FieldOption[]>("options", `${ref}.json`);
  } catch {
    opts = [];
  }
  optionCache.set(ref, opts);
  return opts;
}

export function getCategories(): Category[] {
  return readJson<Category[]>("categories.json");
}

export function getCategory(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

function resolveGenerator(
  categoryId: string,
  gen: GeneratorType,
): ResolvedGenerator {
  const fields: ResolvedField[] = gen.fields.map((f) => {
    const { optionsRef, options, ...rest } = f;
    const resolved = optionsRef ? loadOptions(optionsRef) : options;
    return { ...rest, options: resolved };
  });
  return { ...gen, category: categoryId, fields };
}

export function getGenerators(categoryId: string): ResolvedGenerator[] {
  let raw: GeneratorType[];
  try {
    raw = readJson<GeneratorType[]>("generators", `${categoryId}.json`);
  } catch {
    return [];
  }
  return raw.map((g) => resolveGenerator(categoryId, g));
}

export function getGenerator(
  categoryId: string,
  generatorId: string,
): ResolvedGenerator | undefined {
  return getGenerators(categoryId).find((g) => g.id === generatorId);
}

/** Every (category, generator) pair — used by generateStaticParams. */
export function getAllGeneratorParams(): {
  category: string;
  generator: string;
}[] {
  return getCategories().flatMap((c) =>
    getGenerators(c.id).map((g) => ({ category: c.id, generator: g.id })),
  );
}
