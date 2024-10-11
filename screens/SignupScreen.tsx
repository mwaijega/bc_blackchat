import React from 'react';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import App from '../App';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { NavigationProp } from '@react-navigation/native';

// Define the props type
interface SignupScreenProps {
  navigation: NavigationProp<any>;
}

const LoginScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}
    >
      <Image
        source={{ uri: 'http://192.155.92.17/images/form.png' }}
        style={{
          marginTop: 30,
          height: 600,
          width: '100%', // Full width
          position: 'absolute', // Set position to absolute
          left: '0%', // Align to the left
          top: 0, // Align to the top
        }}
      />

      {/* Centered text overlay */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0, // Make it stretch across the screen
          alignItems: 'center', // Center horizontally
          justifyContent: 'center', // Center vertically if needed
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontFamily: 'Roboto_700Bold',
            top: 150,
          }}
        >
          BLACKUP
        </Text>
      </View>

      {/* Input fields for security number and password */}
      <View style={{ top: 250, marginHorizontal: 30 }}>
        {/* Security Number Input */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Roboto_400Regular',
            }}
          >
            Security Number
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 10,
              height: 63,
              marginTop: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}
          >
            <Image
              source={{ uri: 'http://192.155.92.17/images/phone.png' }} // Replace with your logo URI
              style={{ width: 20, height: 20, marginRight: 10 }} // Logo size
            />
            <TextInput
              style={{ flex: 1, color: 'white' }} // Input text color
              placeholder="Enter your security number"
              placeholderTextColor="gray" // Placeholder text color
            />
          </View>
        </View>

        {/* Password Input */}
        <View>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Roboto_400Regular',
            }}
          >
            Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 10,
              height: 63,
              marginTop: 10,
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}
          >
            <Image
              source={{ uri: 'http://192.155.92.17/images/lock.png' }} // Replace with your logo URI
              style={{ width: 20, height: 20, marginRight: 10 }} // Logo size
            />
            <TextInput
              style={{ flex: 1, color: 'white' }} // Input text color
              placeholder="Enter your password"
              placeholderTextColor="gray" // Placeholder text color
              secureTextEntry={true} // Hide password input
            />
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginTop: 40 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'Roboto_400Regular',
              }}
            >
              have an account ?{' '}
              <Text style={{ color: 'lightblue' }}>Login</Text>
            </Text>
          </TouchableOpacity>
          {/*  Button */}
          <TouchableOpacity>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Roboto_700Bold',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 17,
                  paddingVertical: 10,
                  paddingHorizontal: 50,
                  textAlign: 'center',
                }}
              >
                SIGN UP
              </Text>
            </View>
          </TouchableOpacity>

          <Image
            source={{ uri: 'http://192.155.92.17/images/bellow.png' }}
            style={{
              height: 40,
              width: 69,
              marginTop: 60,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
