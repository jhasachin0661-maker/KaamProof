# WCAG 2.1 AA Checklist

## 1. Perceivable
- **1.1.1 Non-text Content**: All images have meaningful `alt` text. Decorative images use `alt=""`.
- **1.3.1 Info and Relationships**: Semantic HTML structure (`<h1>` to `<h6>`, `<p>`, `<ul>`, `<ol>`, `<main>`, `<nav>`).
- **1.4.3 Contrast (Minimum)**: Text contrast at least 4.5:1 for normal text and 3:1 for large text.
- **1.4.11 Non-text Contrast**: Visual boundaries of interactive controls must have at least 3:1 contrast against adjacent background.

## 2. Operable
- **2.1.1 Keyboard**: All functionality operable using standard keyboard keys (`Tab`, `Enter`, `Space`, Arrows).
- **2.1.2 No Keyboard Trap**: Keyboard focus is never trapped indefinitely in any component (except modal dialogs with `Esc` exit).
- **2.4.3 Focus Order**: Logical tab order matching visual document structure.
- **2.4.7 Focus Visible**: Visible focus indicator on focused elements (`:focus-visible`).

## 3. Understandable
- **3.1.1 Language of Page**: `<html lang="en">` attribute present on root html tag.
- **3.3.2 Labels or Instructions**: Labels provided for all user inputs.

## 4. Robust
- **4.1.2 Name, Role, Value**: Custom UI components have proper ARIA name, role, and states.
