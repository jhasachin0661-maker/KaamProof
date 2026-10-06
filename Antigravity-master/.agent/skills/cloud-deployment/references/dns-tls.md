# DNS, SSL/TLS, and Custom Domains Guide

## DNS Record Types
- **A Record**: Maps hostname to IPv4 address.
- **AAAA Record**: Maps hostname to IPv6 address.
- **CNAME Record**: Maps alias hostname to canonical domain name.
- **TXT Record**: Verification strings (SPF, DKIM, site verification).

## SSL/TLS Provisioning
- Automated issuance via Let's Encrypt / ACME, Cloudflare Universal SSL, or AWS ACM.
- Always enforce HTTP-to-HTTPS redirection and HSTS (`Strict-Transport-Security`).
