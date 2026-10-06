# Vue Guidelines

## Version Check Requirement
Check `vue` version in `package.json` (Vue 2 vs Vue 3).
- For Vue 3, prefer Composition API with `<script setup lang="ts">`.
- Use `ref` and `reactive` explicitly. Avoid `v-html` with untrusted input to prevent XSS.
