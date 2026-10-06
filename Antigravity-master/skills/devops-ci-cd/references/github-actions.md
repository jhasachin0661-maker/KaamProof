# GitHub Actions Best Practices & Syntax

## 1. Pinned Action Versions
Always pin actions using exact 40-character commit SHAs:

```yaml
# GOOD: Pinned SHA with version comment
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
uses: actions/setup-node@39370e3970a6d050c38000445cd901f2714856a9 # v4.1.0
```

## 2. Minimal Permissions Scope
Declare explicit permissions at workflow or job level:

```yaml
name: CI Workflow
on: [push, pull_request]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - run: npm test
```

## 3. Matrix Strategy
Run tests across multi-version environments efficiently:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    steps:
      - uses: actions/setup-node@39370e3970a6d050c38000445cd901f2714856a9 # v4.1.0
        with:
          node-version: ${{ matrix.node-version }}
```
