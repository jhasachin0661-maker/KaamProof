# Structured Data (JSON-LD) Patterns

## Organization Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyApp Inc.",
  "url": "https://myapp.com",
  "logo": "https://myapp.com/logo.png"
}
</script>
```

## Article Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Getting Started with MyApp",
  "author": { "@type": "Person", "name": "Jane Doe" },
  "datePublished": "2026-10-03",
  "image": "https://myapp.com/blog/intro-cover.png"
}
</script>
```

## BreadcrumbList Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://myapp.com" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://myapp.com/blog" }
  ]
}
</script>
```
