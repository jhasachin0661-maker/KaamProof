# EAS Build & App Store Submission

## Installation
```bash
npm install -g eas-cli
eas login
eas build:configure  # Generates eas.json
```

## eas.json Configuration
```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  }
}
```

## Build Commands
```bash
# iOS production build (CRITICAL: triggers App Store submission pipeline)
eas build --platform ios --profile production

# Android production build
eas build --platform android --profile production

# Submit to app stores (CRITICAL: requires explicit human approval)
eas submit --platform ios
eas submit --platform android
```

## Pre-Submission Checklist
- [ ] `npx expo-doctor` exits 0
- [ ] `app.json` version and buildNumber/versionCode incremented
- [ ] Privacy policy and app store screenshots prepared
- [ ] Signing credentials configured in EAS
- [ ] Rollback plan: prior `.ipa`/`.aab` archived for emergency re-submission
