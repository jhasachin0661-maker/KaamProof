# UI Design Anti-Patterns

## 1. Visual Hierarchy Flaws
- **Flat Weight**: All headers and body text using the same font size and weight.
- **Unclear Primary Action**: Multiple buttons competing with identical high-contrast primary styles on a single page.
- **Visual Noise**: Excessive borders, aggressive drop shadows, or unharmonious generic primary colors.

## 2. Spatial & Layout Issues
- **Cramped Spacing**: Insufficient padding (< 12px) inside containers or around clickable targets.
- **Inconsistent Alignment**: Elements misaligned across columns or inconsistent grid gutters.
- **Mobile Overflow**: Fixed pixel widths (`width: 600px`) causing horizontal scrollbars on mobile screens.

## 3. Color & Contrast Problems
- **Low Contrast Text**: Light grey text (`#999999`) on white background failing 4.5:1 WCAG AA standards.
- **Generic Palette**: Default un-customized pure red/blue/green without curated HSL design tokens.

## 4. Missing Component States
- **Blank Slate**: Empty tables/lists showing nothing instead of a helpful empty state illustration or text.
- **Abrupt Loading**: Abrupt layout shifts (CLS) when data loads instead of using skeleton loaders.
