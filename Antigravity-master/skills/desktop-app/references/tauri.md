# Tauri Architecture

## Core Model
- **Rust backend**: Business logic, system API access, file I/O, and process management run in Rust.
- **Webview frontend**: UI rendered in the OS webview (WebView2 on Windows, WebKit on macOS/Linux). No bundled Chromium, resulting in significantly smaller binaries than Electron.
- **Commands**: Frontend calls Rust functions via `tauri::command`; responses are serialized via serde.

## Permission Scoping
- Tauri v2 uses a capability-based permission system. Each window declares required permissions in `tauri.conf.json` under `capabilities`.
- Start with minimal permissions; add only what the feature requires (e.g., `fs:read`, `shell:open`).
- Never grant `fs:scope` to the entire filesystem; scope to specific directories.

## Command Pattern
```rust
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}
// Register in builder
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_file])
```

## Frontend Integration
```typescript
import { invoke } from '@tauri-apps/api/core';
const content = await invoke<string>('read_file', { path: '/tmp/data.txt' });
```

## Build and Bundle
- `cargo tauri build` produces platform installers (MSI/NSIS on Windows, DMG on macOS, AppImage/deb on Linux).
- Bundle size typically 5-15 MB vs 150+ MB for Electron.
- Use `tauri-plugin-updater` for auto-update with signed update manifests.
