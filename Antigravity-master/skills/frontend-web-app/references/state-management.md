# State Management Patterns

## Client vs Server State
- **Server State**: Manage API data caching using tools like React Query (TanStack Query), SWR, or RTK Query.
- **Local Client State**: Keep transient UI state (modal open/close, accordion expansion) in local component state hooks.
- **Global State**: Use Zustand, Redix Toolkit, Pinia, or Context API for cross-cutting global client state.
