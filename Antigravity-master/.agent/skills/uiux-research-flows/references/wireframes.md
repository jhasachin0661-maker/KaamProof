# Wireframing Patterns (ASCII & HTML)

## 1. ASCII Wireframe Pattern
```
+-------------------------------------------------------------+
| [Logo] My App          [Search        ]   (Bell)  [Avatar]  |
+-------------------------------------------------------------+
| (Nav)              | Dashboard / Analytics                  |
| - Overview         | +------------------------------------+ |
| - Tasks            | | Total Revenue: $42,000            | |
| - Reports          | +------------------------------------+ |
| - Settings         | | [ Chart Placeholder              ] | |
|                    | |                                    | |
|                    | +------------------------------------+ |
|                    | | [ Export Report Button ]           | |
+--------------------+----------------------------------------+
```

## 2. Low-Fidelity HTML Wireframe Pattern
```html
<div style="display: grid; grid-template-columns: 200px 1fr; font-family: sans-serif;">
  <aside style="background: #f0f0f0; padding: 16px;">
    <h3>Sidebar Nav</h3>
    <ul><li>Dashboard</li><li>Settings</li></ul>
  </aside>
  <main style="padding: 24px;">
    <h1>Main Dashboard</h1>
    <button>Primary Action</button>
  </main>
</div>
```
