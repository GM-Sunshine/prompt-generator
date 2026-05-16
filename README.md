# Prompt Forge

An open-source, **JSON-driven AI prompt generator**. Pick a category, choose a
generator type, answer a few guided questions, and Prompt Forge assembles a
sharp, reusable prompt — then exports it formatted for ChatGPT, Cursor and
more.

No API keys. No LLM calls. Every page is server-rendered from JSON.

- **Categories**: Software Development · Content & Writing · Data & Analysis · Design & UX
- **Multi-model export**: Plain · ChatGPT · XML / Structured · Cursor · System + User
- **All content is data**: add a category or generator by editing JSON — no code
- **Conditional templates**: `{{#if}}`, `{{#each}}`, equality — no `eval`

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm test                     # template-engine unit tests
npm run lint
```

## How it works

```
data/
  categories.json              the top-level categories
  options/<ref>.json           shared option pools (stacks, languages, …)
  generators/<category>.json    generator types: fields[] + a template
```

1. The user picks a category → a generator type.
2. The generator's `fields[]` render as inputs/toggles/selection pills.
3. Selections feed a [conditional-block template](#template-syntax).
4. The rendered prompt is reshaped per export target and copied/downloaded.

Routes are statically generated (`generateStaticParams`); the only client code
is the interactive builder island.

### Adding content (no code)

Add a generator type by appending an object to the relevant
`data/generators/<category>.json`:

```jsonc
{
  "id": "my-generator",
  "label": "My Generator",
  "description": "What it produces.",
  "icon": "Wand2",                       // any lucide-react icon name
  "fields": [
    { "id": "name", "label": "Name", "type": "text", "required": true },
    { "id": "stack", "label": "Stack", "type": "select", "optionsRef": "stacks" },
    { "id": "tests", "label": "Add tests", "type": "toggle", "default": true }
  ],
  "template": "Build {{name}}.{{#if tests}} Include tests.{{/if}}"
}
```

Field types: `text`, `textarea`, `select`, `multi-select`, `toggle`. Options come
inline (`options`) or from a shared pool (`optionsRef` → `data/options/<ref>.json`).

### Template syntax

```
{{ name }}                       interpolate (arrays join with ", ")
{{#if x}} … {{else}} … {{/if}}    truthiness
{{#if x == "y"}} … {{/if}}        equality (also !=; arrays test includes)
{{#unless x}} … {{/unless}}
{{#each list}} {{this}} {{@index}} {{@last}} {{/each}}
```

See `src/lib/template.ts` and its tests in `src/lib/template.test.ts`.

## Tech

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Vitest.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). New generators and option pools are the
most welcome contributions — they're pure JSON.

## License

[MIT](./LICENSE)
