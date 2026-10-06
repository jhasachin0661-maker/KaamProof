# Electron Architecture

## Process Model
- **Main process**: Node.js runtime, manages windows, system tray, menus, native dialogs, and IPC.
- **Renderer process**: Chromium web page, sandboxed by default (Electron 20+). Communicate with main via `contextBridge` and `ipcRenderer`.
- **Preload script**: Runs in renderer context with limited Node access. Expose a minimal API surface via `contextBridge.exposeInMainWorld`.

## Security Essentials
- Enable `contextIsolation: true` and `sandbox: true` on every BrowserWindow.
- Never set `nodeIntegration: true` in renderer.
- Validate all IPC arguments in the main process handler; treat renderer messages as untrusted input.
- Use `safeStorage` for credentials; never store secrets in localStorage or plain files.
- Set a strict Content-Security-Policy header via `session.defaultSession.webRequest`.

## Window Management
```javascript
const { BrowserWindow } = require('electron');
const win = new BrowserWindow({
  width: 1200, height: 800,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    sandbox: true
  }
});
```

## IPC Pattern
```javascript
// preload.js
contextBridge.exposeInMainWorld('api', {
  readFile: (path) => ipcRenderer.invoke('fs:read', path)
});
// main.js
ipcMain.handle('fs:read', async (event, filePath) => {
  // validate filePath before reading
  return fs.promises.readFile(filePath, 'utf-8');
});
```

## Dev Tooling
- Use `electron-reload` or `electron-vite` for hot reload during development.
- Debug main process via `--inspect` flag; renderer via DevTools.
- Lint with ESLint; type-check with TypeScript for both processes.
