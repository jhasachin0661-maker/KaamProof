# Mobile Storage Patterns

## AsyncStorage (General Data)
```bash
npx expo install @react-native-async-storage/async-storage
```
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('key', JSON.stringify(value));
const raw = await AsyncStorage.getItem('key');
const value = raw ? JSON.parse(raw) : null; // Always handle null
```

## expo-secure-store (Sensitive / Auth Tokens)
```bash
npx expo install expo-secure-store
```
```tsx
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('authToken', token);
const token = await SecureStore.getItemAsync('authToken'); // May return null
```

## MMKV (High-Performance)
```bash
npx expo install react-native-mmkv
```
- Use for high-frequency reads/writes (e.g. real-time state persistence).
- Not encrypted by default; do not store auth tokens in MMKV.
