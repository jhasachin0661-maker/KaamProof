# Implementation Verification Checklist

Perform these mandatory checks before declaring an implementation step complete.

## Pre-Implementation Checklist
- [ ] Read `.agent/context/project-context.json` to verify stack and build commands.
- [ ] Inspect existing sibling files to identify coding conventions (tabs vs spaces, export style, casing).
- [ ] Check if multi-file edits require a git checkpoint (`git commit` or `git stash`).

## Post-Implementation Checklist
- [ ] Run typecheck command (e.g. `npx tsc --noEmit` exit 0).
- [ ] Run linter command (e.g. `npm run lint` exit 0).
- [ ] Run build command (e.g. `npm run build` exit 0).
- [ ] Verify no secrets, passwords, or raw tokens were written into source code.
- [ ] Populate handoff `FILES_CHANGED` section with exact file paths.
