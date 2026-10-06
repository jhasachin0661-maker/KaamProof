# Push Notifications (Expo)

## Installation
```bash
npx expo install expo-notifications expo-device
```

## Permission Request Flow
```tsx
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null; // Simulators cannot receive push

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null; // User denied

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
```

## FCM/APNs Setup
- Android: Add `google-services.json` to project root and configure in `app.json`.
- iOS: Enable Push Notification capability in Apple Developer Portal and configure via EAS credentials.
