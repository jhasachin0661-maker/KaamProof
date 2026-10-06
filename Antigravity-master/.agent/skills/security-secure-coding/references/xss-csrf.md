# XSS & CSRF Prevention Guidelines

## Cross-Site Scripting (XSS)
- **Reflected & Stored XSS**: Always escape HTML characters (`&`, `<`, `>`, `"`, `'`, `/`) before rendering untrusted input in HTML context.
- **DOM-based XSS**: Avoid assigning untrusted data directly to `innerHTML`, `outerHTML`, or `document.write()`. Use `textContent` or framework templating mechanisms (React `{value}`, Vue `{{value}}`).

## Cross-Site Request Forgery (CSRF)
- **Anti-CSRF Tokens**: Require unique CSRF validation tokens for all state-changing endpoints (`POST`, `PUT`, `DELETE`, `PATCH`).
- **Cookie SameSite Attribute**: Set `SameSite=Lax` or `SameSite=Strict` on authentication cookies.
- **Custom Headers**: For API endpoints accessed via AJAX/fetch, require custom headers like `X-Requested-With` or `Content-Type: application/json`.
