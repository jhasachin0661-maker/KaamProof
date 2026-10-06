# Indexing Controls & Social Tags

## Robots Meta Tags
```html
<!-- Index and follow (default) -->
<meta name="robots" content="index, follow">

<!-- Block indexing for auth/private pages -->
<meta name="robots" content="noindex, nofollow">
```

## Open Graph Tags
```html
<meta property="og:type" content="website">
<meta property="og:title" content="MyApp - Project Management">
<meta property="og:description" content="Manage projects at any scale.">
<meta property="og:image" content="https://myapp.com/social-card.png">
<meta property="og:url" content="https://myapp.com">
```

## Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MyApp - Project Management">
<meta name="twitter:description" content="Manage projects at any scale.">
<meta name="twitter:image" content="https://myapp.com/social-card.png">
```

## Rules
- OG image: minimum 1200×630 pixels.
- Use `noindex` on all auth-gated, pagination, and search result pages.
- Duplicate/thin content pages must have a canonical pointing to the primary page.
