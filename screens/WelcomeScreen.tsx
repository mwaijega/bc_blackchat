// WelcomeScreen.tsx
import React from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParams } from '../routes'; // Import your StackParams type

// Define the props type
interface WelcomeScreenProps {
  navigation: StackNavigationProp<StackParams, 'Welcome'>; // Specific navigation type
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
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
            onPress={() => navigation.replace('Login')} // Now it recognizes `replace`
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
            onPress={() => navigation.replace('Signup')} // Now it recognizes `replace`
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
