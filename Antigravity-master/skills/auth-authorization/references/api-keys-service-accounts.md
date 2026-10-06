# API Keys & Service Account Security

## API Keys
- Store API key hashes (e.g. SHA-256 with pepper) in database, never raw keys.
- Return raw key `ak_live_...` ONLY ONCE upon creation.
- Associate explicit scopes with API keys (`read:products`, `write:orders`).
- Implement per-key IP whitelisting and rate limiting.

## Service Accounts
- Non-human identities used by background workers, cron jobs, and inter-service calls.
- Authenticate via mTLS, short-lived JWTs, or secret keys managed in vault.
- Enforce strict principle of least privilege: service accounts should only access the specific endpoints required for their task.
