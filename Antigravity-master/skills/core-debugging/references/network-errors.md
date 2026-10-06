# Network & Connectivity Error Guide

## Symptoms & Error Codes
- `ETIMEDOUT`: Connection timed out reaching remote service.
- `ENOTFOUND`: DNS lookup failed for hostname.
- `ECONNRESET` / `socket hang up`: Connection dropped by remote server.

## Usual Causes
1. Remote service is down or unreachable from current network.
2. Incorrect hostname or port in connection string.
3. Firewall or proxy blocking outbound connections.

## Diagnostic Commands
- Test connectivity: `curl -v https://target-host` or `ping target-host`
- Check DNS: `nslookup target-host`

## Safe Fixes
- Verify hostname and port in environment variables or config files.
- Check VPN or proxy settings if targeting internal services.
- Add connection timeout and retry logic with exponential backoff.
