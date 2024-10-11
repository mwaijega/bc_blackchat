import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { NavigationProp } from '@react-navigation/native';

// Define the props type
interface WelcomeScreenProps {
  navigation: NavigationProp<any>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  // Track font loading state
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  // Check if fonts are loaded and set loading state accordingly
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
        {/* Use the correct `source` prop for a remote image */}
        <Image
          source={{ uri: 'http://192.155.92.17/images/logo_two.png' }}
          style={{ width: 200, height: 200 }} // Adjust size as needed
        />
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            marginHorizontal: 30,
            marginTop: 120,
            fontFamily: 'Roboto_400Regular',
            fontSize: 18,
          }}
        >
          Forged like magma in the heart of a mountain, Blackchat empowers you
          with unbreakable, robotic protection.
        </Text>
        <View style={{ marginTop: 80 }}>
          <TouchableOpacity
            id="login"
            style={{
              backgroundColor: 'transparent', // Transparent background
              borderColor: 'white', // White border color
              borderWidth: 1, // Border width
              borderRadius: 17, // Border radius
              paddingVertical: 10, // Vertical padding
              paddingHorizontal: 20, // Horizontal padding
              alignItems: 'center', // Center text
              marginTop: 20, // Margin above the button
              height: 61,
              width: 290,
              justifyContent: 'center', // Center the button in its container
            }}
            onPress={() => navigation.navigate('Login')} // Navigate to Login screen
          >
            <Text
              style={{
                fontSize: 18, // Font size
                fontWeight: 'bold', // Bold font
                color: 'white', // Text color
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            id="register"
            style={{
              backgroundColor: 'white', // White background
              borderColor: 'white', // White border color
              borderWidth: 1, // Border width
              borderRadius: 17, // Border radius
              paddingVertical: 10, // Vertical padding
              paddingHorizontal: 20, // Horizontal padding
              alignItems: 'center', // Center text
              marginTop: 20, // Margin above the button
              height: 61,
              width: 290,
              justifyContent: 'center', // Center the button in its container
            }}
            onPress={() => navigation.navigate('Signup')} // Navigate to Signup screen
          >
            <Text
              style={{
                fontSize: 18, // Font size
                fontWeight: 'bold', // Bold font
                color: 'black', // Text color
              }}
            >
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
