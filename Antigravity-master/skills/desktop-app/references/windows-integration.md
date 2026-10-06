# Windows Integration

## System Tray
- Electron: `new Tray(iconPath)` with `tray.setContextMenu()`.
- Tauri: `SystemTray::new()` with menu items in Rust.
- PySide6: `QSystemTrayIcon` with `QMenu`.
- Always provide a way to restore the main window from the tray icon (double-click or menu item).

## Filesystem Access
- Use app-scoped directories: `app.getPath('userData')` (Electron), `app_data_dir()` (Tauri), `QStandardPaths` (PySide6).
- Never write to system directories without explicit user consent and HIGH approval.
- Validate paths against directory traversal attacks when accepting user input.

## Process Management
- Electron: `child_process.spawn()` in main process only, never renderer.
- Tauri: `tauri::api::process::Command` with scoped shell permissions.
- PySide6: `QProcess` for managed subprocesses with signal-based stdout/stderr capture.
- Always handle process exit codes and stderr output.

## Native Menus
- Application menu bar: use framework-native APIs (`Menu.buildFromTemplate` in Electron, `QMenuBar` in PySide6).
- Context menus: attach to right-click events with framework-appropriate handlers.

## Notifications
- Electron: `new Notification({ title, body })` in main process.
- Tauri: `tauri-plugin-notification`.
- PySide6: `QSystemTrayIcon.showMessage()`.
- On Windows, register the app in the Start menu for toast notifications to work reliably.

## Registry and Settings
- Use `QSettings` (PySide6), `electron-store` (Electron), or `tauri-plugin-store` (Tauri) for persistent settings.
- Never write directly to the Windows registry unless the feature specifically requires it (e.g., file type association), and document the keys touched.
