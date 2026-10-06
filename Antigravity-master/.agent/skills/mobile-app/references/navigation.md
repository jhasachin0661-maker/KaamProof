# React Navigation Patterns

## Installation
```bash
npx expo install @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context
```

## Stack Navigator
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Tab Navigator
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
// Wrap screens in Tab.Navigator inside NavigationContainer
```
