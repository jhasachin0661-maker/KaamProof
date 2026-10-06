# Documentation Source Hierarchy

When conducting technical research, information sources must be evaluated according to a strict priority hierarchy.

## Source Priority Tier List

| Priority Tier | Source Type | Usage Guidelines |
|---|---|---|
| **Tier 1 (Highest)** | Repository Lockfiles & Installed Code | Read package versions directly from `package-lock.json`, `poetry.lock`, `Cargo.lock`. Inspect installed type definitions (`node_modules/@types`) and source code. |
| **Tier 2** | Official Framework & Library Docs | Official documentation sites (e.g. Next.js docs, React docs, Python stdlib docs, RFC specs). Always verify version match. |
| **Tier 3** | Official GitHub Repositories & Release Notes | Official repository READMEs, GitHub releases, changelogs, and official issue trackers. |
| **Tier 4** | Verified Tech Blogs & Q&A | StackOverflow, official blog posts (with published dates and version references). |
| **Tier 5 (Lowest)** | Generic Search Results & AI Summaries | Must be cross-verified against Tier 1 or Tier 2 sources before marking as `VERIFIED`. |

## Evidence Labeling Rules
- **VERIFIED**: Claim backed by Tier 1 or Tier 2 source. Format: `VERIFIED [Source: <URL/file>, Version: <X.Y.Z>, Date: <YYYY-MM-DD>]`.
- **ASSUMPTION**: Unconfirmed claim or inference. Format: `ASSUMPTION [Requires confirmation: <reason>]`.
