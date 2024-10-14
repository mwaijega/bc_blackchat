// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';

// Define your stack parameters
export type StackParams = {
  Welcome: undefined; // No parameters for Welcome screen
  Login: undefined; // No parameters for Login screen
  Signup: undefined; // No parameters for Signup screen
  Home: undefined; // No parameters for Home screen
};

const Stack = createNativeStackNavigator<StackParams>(); // Create the stack navigator with type

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          options={{ headerShown: false }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false }}
          component={SignupScreen}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen} // HomeScreen component
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
