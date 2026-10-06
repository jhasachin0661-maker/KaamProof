# Sitemap & robots.txt

## sitemap.xml Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myapp.com/</loc>
    <lastmod>2026-10-03</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://myapp.com/features</loc>
    <lastmod>2026-09-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

## robots.txt Format
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://myapp.com/sitemap.xml
```

## Checklist
- `sitemap.xml` served at `/sitemap.xml` (HTTP 200, `application/xml`).
- `robots.txt` served at `/robots.txt` (HTTP 200, `text/plain`).
- Block `/api/`, `/admin/`, and any auth-gated routes in `robots.txt`.
