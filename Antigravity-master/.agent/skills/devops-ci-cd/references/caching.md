# CI Caching Strategies

## Built-in Setup Caching

### npm / pnpm / yarn
```yaml
- uses: actions/setup-node@39370e3970a6d050c38000445cd901f2714856a9 # v4.1.0
  with:
    node-version: 20
    cache: 'npm'
```

### Python (uv / pip)
```yaml
- uses: actions/setup-python@0b5932626e1ee592ec1656757d5776d6c97ab644 # v5.2.0
  with:
    python-version: '3.11'
    cache: 'pip'
```

## Generic Cache Action
```yaml
- name: Cache Cargo dependencies
  uses: actions/cache@d4323d4df104b026a6aa633fdb11d772146be0bf # v4.2.2
  with:
    path: ~/.cargo/registry
    key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
    restore-keys: |
      ${{ runner.os }}-cargo-
```
