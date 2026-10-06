---
name: mobile-app
description: Build and maintain mobile applications with React Native/Expo, Flutter, Kotlin Android, or Swift iOS; cover architecture, offline-first behavior, push notifications, deep links, auth security, performance, and store release. Trigger for mobile UI, native APIs, app builds, or store submission, even if mobile is implicit.
metadata:
  category: mobile
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, auth-authentication
  risk_max: HIGH
---

# Mobile App

## Purpose
Build and maintain mobile products across React Native/Expo, Flutter, Kotlin Android, and Swift iOS. Keep platform guidance in references so the grouped skill stays portable; split a stack into its own skill only when its reference exceeds about 300 lines or creates trigger collisions.

## When NOT to use
- Do not use for web-only applications or backend services.
- Do not submit an app to a store without the CRITICAL approval described in `references/store-release.md`.

## Inputs
- Mobile source, platform manifests, build configuration, and `.agent/context/project-context.json`.

## Procedure
1. Identify the stack and inspect project context; if context is missing, run core-repo-discovery.
2. Choose architecture and platform conventions from the relevant framework reference.
3. Design offline behavior, auth boundaries, notifications, deep links, and performance budgets before implementation.
4. Validate on representative platforms, then prepare a signed release only after approval.

## Validation
- Framework checks and platform builds pass for the changed targets; cite commands and exit codes.
- Offline, notification, deep-link, auth, and accessibility paths have explicit test evidence or are marked NOT VERIFIED.
- Store submission remains gated as CRITICAL.

## Failure handling
- If a capability requires a workflow migration or platform credential, document the impact and pause for the appropriate approval.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local code, tests, and simulator checks.
- `HIGH`: Shared/staging builds, permission scope changes, or credential-dependent release preparation.
- `CRITICAL`: Production App Store / Google Play submissions.

## Output
- Handoff file in `.agent/context/handoffs/NN-mobile-app.md` per `references/output-contract.md`.
- Updated React Native source files, navigation config, and EAS build configuration.

## References index
- `references/react-native-expo.md`: React Native and Expo architecture.
- `references/flutter.md`: Flutter architecture and platform integration.
- `references/android-kotlin.md`: Kotlin Android conventions.
- `references/ios-swift.md`: Swift iOS conventions.
- `references/offline-first.md`: Sync, caching, conflict, and recovery design.
- `references/push-deeplinks.md`: Notification permissions and deep-link routing.
- `references/mobile-security.md`: Mobile auth, secrets, transport, and device risks.
- `references/store-release.md`: Release checks and CRITICAL submission gate.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
