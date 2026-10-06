# Packaging and Installers

## Electron
- **electron-builder**: Primary tool. Supports NSIS, MSI, DMG, AppImage, deb, snap.
  - Configure in `package.json` under `build` key or `electron-builder.yml`.
  - NSIS is the default Windows target; supports custom installer pages and per-user/machine install.
- **electron-forge**: Alternative with Webpack/Vite integration and maker plugins.

## Tauri
- `cargo tauri build` generates platform installers natively:
  - Windows: NSIS or MSI via WiX.
  - macOS: DMG and .app bundle.
  - Linux: AppImage, deb.
- Configure in `tauri.conf.json` under `bundle`.

## PySide6 / Python
- **PyInstaller**: `pyinstaller --onefile --windowed main.py`. Add `--icon=app.ico`.
- **cx_Freeze**: Alternative with `setup.py`-based configuration.
- Wrap output with Inno Setup (Windows) or NSIS for a proper installer experience.

## Code Signing (CRITICAL)
- **Windows**: Requires an EV or OV code signing certificate. Sign with `signtool.exe`.
  - Unsigned apps trigger SmartScreen warnings and may be blocked by enterprise policies.
- **macOS**: Requires Apple Developer certificate. Sign with `codesign`, notarize with `xcrun notarytool`.
- Never store signing keys in the repository. Use CI secrets or hardware tokens.
- Code signing configuration and certificate usage is **CRITICAL** risk; requires explicit per-action approval.

## Distribution Checklist
1. Verify the installer runs on a clean OS image (no dev dependencies).
2. Confirm uninstaller removes all app files and registry entries.
3. Test upgrade from a previous version preserves user data.
4. Validate digital signature with `signtool verify` or `codesign -v`.
