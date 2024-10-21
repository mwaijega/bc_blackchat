import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { StackParams } from './routes'; // Import your stack params type
import SplashScreenView from './SplashScreenView';

const Stack = createNativeStackNavigator<StackParams>(); // Pass StackParams type

export default function App() {
  const [isShowSplash, setisShowSplash] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setisShowSplash(false);
    }, 3000);
  });
  return (
    <>
      {isShowSplash ? (
        <SplashScreenView />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
            {/* Ensure ChatScreen is typed correctly */}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
