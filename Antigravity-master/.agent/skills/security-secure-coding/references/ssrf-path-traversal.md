# SSRF & Path Traversal Prevention

## Server-Side Request Forgery (SSRF)
- **URL Validation**: Parse URLs and validate scheme (`https://` only) and destination host.
- **IP Deny List**: Reject requests to internal IPs (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`).
- **DNS Resolution**: Resolve hostname to IP before connecting and check resolved IP against private IP range.

## Path Traversal
- **Vulnerable Pattern**: `path.join(upload_dir, req.query.filename)` allows filenames like `../../etc/passwd`.
- **Remediation**:
  1. Strip directory traversal sequences (`..`).
  2. Use `path.basename(filename)`.
  3. Verify resolved canonical path (`fs.realpathSync`) starts with allowed root directory path (`upload_dir`).
