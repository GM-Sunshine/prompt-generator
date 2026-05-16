# Contributing

Thanks for helping make Prompt Generator better!

## Most wanted: new generators (pure JSON, no code)

The highest-value contributions are new generator types and option pools. They
require no code:

1. Edit the relevant `data/generators/<category>.json` (or add a new category in
   `data/categories.json` + a new `data/generators/<id>.json`).
2. Use shared option pools via `optionsRef`, or add a new pool under
   `data/options/`.
3. Write a strong `template` using the [supported syntax](./README.md#template-syntax).
4. Run `npm run dev` and verify the live preview reads well across toggles.

**Prompt quality bar:** prompts should set a clear role, be specific, prefer
sensible defaults over asking, and end with concrete deliverables. Avoid vague
filler.

## Code changes

```bash
npm install
npm test          # template engine — add cases for any engine change
npm run lint
npm run build     # must pass; routes are statically generated
```

- TypeScript, no `any` unless justified.
- Keep the builder the only client component; data access stays server-side
  (`src/lib/data.ts`).
- The template engine must remain dependency-free and **must not use `eval`**.

## Pull requests

Keep PRs focused. Describe the change and include a screenshot for UI changes.
By contributing you agree your work is licensed under the project's
[MIT License](./LICENSE).
