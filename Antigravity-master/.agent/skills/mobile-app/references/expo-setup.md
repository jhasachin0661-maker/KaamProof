# Expo Project Setup

## Create New Project
```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
npx expo-doctor  # Must exit 0
```

## Validate SDK Version
Always check current Expo SDK version at https://expo.dev/changelog before writing code. Update `package.json` and `app.json` to match.

## Managed vs Bare Workflow
- **Managed**: Default; prefer for all projects. Expo handles native builds.
- **Bare**: Only if a native module is unavailable in managed. Ejecting is MEDIUM risk; document for human approval before proceeding.

## app.json Essentials
```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "sdkVersion": "51.0.0",
    "ios": { "bundleIdentifier": "com.myorg.myapp" },
    "android": { "package": "com.myorg.myapp" }
  }
}
```
