# Cargo Package Management (Rust)

## Commands
- Outdated check: `cargo outdated`
- Security audit: `cargo audit`
- Lockfile verify: `cargo check --locked`
- Update dependencies: `cargo update`

## Best Practices
- Verify feature flags when upgrading dependencies in `Cargo.toml`.
- Check MSRV (Minimum Supported Rust Version) compatibility before upgrading dependencies.
