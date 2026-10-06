# Auto-Update Mechanisms

## CRITICAL Risk Gate
Publishing updates and managing signing keys are **CRITICAL** operations. Before any update publish:
1. Present the exact update payload, version, and target channel.
2. Show the rollback plan (previous version remains available).
3. Require explicit per-action human approval. Never pre-grant or cache across sessions.

## Electron (electron-updater)
```javascript
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
autoUpdater.on('update-downloaded', (info) => {
  // Prompt user or auto-install on quit
  autoUpdater.quitAndInstall();
});
```
- Publish to GitHub Releases, S3, or a custom server.
- Configure `publish` in `electron-builder.yml` with provider and credentials.
- Sign releases; unsigned updates should be rejected by the client.

## Tauri (tauri-plugin-updater)
- Configure update endpoint in `tauri.conf.json` under `plugins.updater`.
- Server returns a signed JSON manifest with version, URL, and signature.
- Client verifies the signature before applying the update.
- Use `dangerous_insecure_transport_protocol: false` (default) to enforce HTTPS.

## PySide6 / Python
- No built-in auto-update. Common patterns:
  - Check a version endpoint on startup; download and replace the executable.
  - Use `pyupdater` for delta updates with code signing.
  - On Windows, trigger the NSIS/Inno installer in silent mode for upgrades.
- Always verify download integrity (SHA-256 hash or GPG signature) before replacing the running binary.

## Security Requirements
- All update channels must use HTTPS.
- Update manifests must be signed; clients must verify signatures before installation.
- Pin the update server certificate or use certificate transparency monitoring.
- Log update events (check, download, install, rollback) for audit.
