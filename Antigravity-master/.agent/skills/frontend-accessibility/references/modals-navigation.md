# Accessible Modals and Navigation

## Modal Dialog Rules
1. Set `role="dialog"` and `aria-modal="true"`.
2. Set `aria-labelledby` pointing to modal title ID.
3. Trap focus inside modal while open (`Tab` cycles inside dialog).
4. Restore focus to triggering element when modal closes.
5. Close modal on `Escape` key press.

```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" id="confirm-modal">
  <h2 id="modal-title">Delete Account</h2>
  <p>Are you sure you want to delete your account?</p>
  <button id="cancel-btn">Cancel</button>
  <button id="confirm-btn">Delete</button>
</div>
```

## Navigation Bar Rules
- Wrap main navigation in `<nav aria-label="Main Navigation">`.
- Dropdown menus must toggle via `aria-expanded` and handle arrow key navigation.
