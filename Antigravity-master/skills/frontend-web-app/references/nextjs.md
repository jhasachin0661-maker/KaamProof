# Next.js Guidelines & Version Caveats

## Version Check Requirement
- Inspect `next` version in `package.json`.
- **Next.js 13/14 vs 15**:
  - Next.js 15 requires async `params` and `searchParams` in Page/Layout props (`await params`).
  - Next.js 15 defaults `fetch` requests to `no-store` uncached unless explicit caching is configured.

## App Router vs Pages Router
- Default to App Router (`app/` directory).
- Mark Client Components explicitly with `'use client'` directive at the top of the file when using event listeners, state hooks, or browser APIs.
- Keep React Server Components (RSC) as default for data-fetching nodes.
