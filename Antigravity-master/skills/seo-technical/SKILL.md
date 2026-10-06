---
name: seo-technical
description: Technical SEO implementation including metadata, structured data, sitemap, robots.txt, canonical URLs, Open Graph/social cards, indexing, internal linking, and page performance. Trigger whenever implementing SEO tags, structured data schemas, canonical links, sitemap generation, robots.txt, or Core Web Vitals, even if SEO is not explicitly named.
metadata:
  category: seo
  priority: P2
  layer: verify
  version: 0.1.0
  reads_from: frontend-web-app
  risk_max: LOW
---

# SEO Technical

## Purpose
Implement and audit technical SEO foundations for web applications: page metadata, JSON-LD structured data, XML sitemaps, robots.txt, canonical URLs, Open Graph / Twitter Card social tags, crawl indexing controls, internal linking strategy, and page performance signals that affect search engine ranking.

## When NOT to use
- Do not use for general frontend UI styling unrelated to SEO metadata (use `uiux-visual-design`).
- Do not use for content marketing copywriting or keyword strategy.

## Inputs
- Frontend HTML templates, Next.js/Nuxt/Astro config, sitemap generator scripts, `.agent/context/project-context.json`.

## Procedure
1. **Page Metadata**:
   - Implement `<title>`, `<meta name="description">`, and `<link rel="canonical">` tags per `references/metadata.md`.
2. **Structured Data (JSON-LD)**:
   - Add schema.org JSON-LD types (`Organization`, `WebPage`, `Article`, `Product`, `BreadcrumbList`) per `references/structured-data.md`.
3. **Sitemap & robots.txt**:
   - Generate `sitemap.xml` with priority and lastmod entries. Configure `robots.txt` with `Allow` / `Disallow` rules per `references/sitemap-robots.md`.
4. **Indexing & Open Graph**:
   - Configure `<meta name="robots">` indexing directives and Open Graph / Twitter Card social preview tags per `references/indexing.md`.
5. **Internal Linking & Performance**:
   - Verify heading hierarchy (single `<h1>` per page), semantic anchor text, and Core Web Vitals signals (LCP, CLS).

## Validation
- All pages have unique `<title>` and `<meta description>` tags.
- Structured data validated via Google Rich Results Test or schema.org validator.
- `sitemap.xml` resolves at `/sitemap.xml` and lists all public routes.
- `robots.txt` at root properly allows crawlers.

## Failure handling
- If sitemap generator fails to enumerate routes, fall back to statically listing primary routes and document missing dynamic routes for manual addition.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: SEO metadata implementation, sitemap generation, and structured data additions.

## Output
- Handoff file in `.agent/context/handoffs/NN-seo-technical.md` per `references/output-contract.md`.
- Updated page templates with metadata, structured data, sitemap, and robots.txt files.

## References index
- `references/metadata.md`: Page title, description, canonical URL, and lang attribute rules.
- `references/structured-data.md`: JSON-LD schema.org structured data patterns and required fields.
- `references/sitemap-robots.md`: XML sitemap format and robots.txt directive syntax.
- `references/indexing.md`: Robots meta tags, Open Graph, and Twitter Card social preview tags.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
