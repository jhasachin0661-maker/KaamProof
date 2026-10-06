# Component State Patterns

## Required States per Component
Every interactive or data-driven component must implement these states:
- **Default**: Base render with populated data.
- **Hover**: Subtle background shift or elevation change on pointer over.
- **Focus-visible**: Keyboard focus ring (3px offset, minimum 3:1 contrast).
- **Active / Pressed**: Visual depression or scale transform feedback.
- **Disabled**: Reduced opacity (0.4-0.5) and cursor-not-allowed.
- **Loading**: Skeleton shimmer or spinner indicating async data fetch.
- **Empty**: Friendly illustration or message when no data exists.
- **Error**: Destructive color indicator and contextual error message.
