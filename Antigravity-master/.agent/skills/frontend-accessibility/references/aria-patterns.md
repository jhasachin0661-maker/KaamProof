# ARIA Authoring Patterns

## Rule 1: Use Semantic HTML First
Never use `<div onClick={...}>` when `<button onClick={...}>` can be used.

## Common Patterns

### Toggle Button
```html
<button aria-pressed="true" onClick={toggle}>
  Mute Audio
</button>
```

### Accordion / Expandable Section
```html
<button aria-expanded="false" aria-controls="section-1" onClick={toggle}>
  Section 1 Title
</button>
<div id="section-1" hidden>
  Section 1 Content
</div>
```

### Alert Message
```html
<div role="alert" aria-live="assertive">
  Form submission failed. Please check your credentials.
</div>
```

### Icon-only Button
```html
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```
