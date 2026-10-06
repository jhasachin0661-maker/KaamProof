---
name: desktop-app
description: Build desktop applications with Electron, Tauri, or PySide6/Python; handle system APIs, tray apps, filesystem and process management, permissions, packaging, installers, and auto-update. Signing keys and update publishing are CRITICAL. Trigger whenever building desktop UIs, native integrations, system tray, or desktop installers, even if desktop is not explicitly named.
metadata:
  category: desktop
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: HIGH
---

# Desktop App

## Purpose
Build cross-platform and native desktop applications using Electron, Tauri, or PySide6/Python. Cover window management, system tray integration, filesystem and process APIs, IPC, permissions, native menus, notifications, packaging with installers, code signing, and auto-update distribution. Framework-specific detail lives in references so the grouped skill stays portable; split a framework into its own skill only when its reference exceeds about 300 lines or creates trigger collisions.

## When NOT to use
- Do not use for web-only applications (use `frontend-web-app`).
- Do not use for mobile applications (use `mobile-app`).
- Do not publish signing keys or update artifacts without the CRITICAL approval described in `references/auto-update.md`.

## Inputs
- Desktop application source, platform manifests, build configuration, and `.agent/context/project-context.json`.

## Procedure
1. Identify the framework (Electron, Tauri, PySide6) and inspect project context; if context is missing, run core-repo-discovery.
2. Choose architecture per the relevant framework reference: main/renderer process split (Electron), Rust/webview boundary (Tauri), or widget tree (PySide6).
3. Implement system integration features (tray, filesystem, IPC, notifications) using the platform-appropriate API surface per `references/windows-integration.md`.
4. Configure packaging and installers per `references/packaging-installers.md`. Prepare code signing and auto-update only after CRITICAL approval per `references/auto-update.md`.
5. Validate builds on target platforms, citing build commands and exit codes.

## Validation
- Framework build and package commands pass for changed targets; cite commands and exit codes.
- IPC, filesystem, tray, and permission paths have explicit test evidence or are marked NOT VERIFIED.
- Code signing and update publishing remain gated as CRITICAL.

## Failure handling
- If packaging or signing requires platform credentials or certificates, document the impact and pause for the appropriate approval level.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local code, tests, and dev builds.
- `MEDIUM`: Adding native dependencies, modifying IPC channels, changing permission manifests.
- `HIGH`: Deleting user data paths, changing auto-update channels, staging builds.
- `CRITICAL`: Code signing with production certificates, publishing updates, releasing installers.

## Output
- Handoff file in `.agent/context/handoffs/NN-desktop-app.md` per `references/output-contract.md`.
- Updated desktop source, build config, and packaging scripts.

## References index
- `references/electron.md`: Electron architecture, main/renderer, preload, and security.
- `references/tauri.md`: Tauri architecture, Rust backend, and permission scoping.
- `references/pyside6.md`: PySide6/Python desktop, widget patterns, and threading.
- `references/windows-integration.md`: System tray, notifications, registry, and filesystem APIs.
- `references/packaging-installers.md`: Platform installers, code signing, and distribution.
- `references/auto-update.md`: Auto-update mechanisms and CRITICAL publishing gate.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
