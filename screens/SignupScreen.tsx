import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { NavigationProp } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { API_URL, ACCESS_TOKEN } from '@env'; // Import from .env
import axios from 'axios';
import CustomMessage from '../components/CustomMessage'; // Import CustomMessage
import { StackParams } from '../routes'; // Import your StackParams type
import { StackNavigationProp } from '@react-navigation/stack';

interface SignupScreenProps {
  navigation: StackNavigationProp<StackParams, 'Login'>; // Specific navigation type
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // CustomMessage state
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkPasswordStrength = (password: string) => {
    setPassword(password);
    if (password.length < 8) {
      setPasswordStrength('Weak');
    } else if (passwordRegex.test(password)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  };

  const handleSignup = async () => {
    if (!passwordRegex.test(password)) {
      setMessageText('Password is not strong enough.');
      setMessageVisible(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/register`,
        {
          phone_number: securityNumber,
          password: password,
        },
        {
          headers: {
            accept: 'application/json',
            access_token: ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        setMessageText('User registered successfully');
        setMessageVisible(true);
        navigation.navigate('Login');
      } else {
        setMessageText(response.data.status || 'Error registering user');
        setMessageVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessageText('Error during signup');
      setMessageVisible(true);
    }
  };

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
          width: '100%',
          position: 'absolute',
          left: '0%',
          top: 0,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
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
              source={{ uri: 'http://192.155.92.17/images/phone.png' }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <TextInput
              style={{ flex: 1, color: 'black' }}
              placeholder="Enter your security number"
              placeholderTextColor="gray"
              value={securityNumber}
              onChangeText={setSecurityNumber}
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
              source={{ uri: 'http://192.155.92.17/images/lock.png' }}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <TextInput
              style={{ flex: 1, color: 'black' }}
              placeholder="Enter your password"
              placeholderTextColor="gray"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={checkPasswordStrength}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Image
                source={{
                  uri: passwordVisible
                    ? 'http://192.155.92.17/images/eye-off.png'
                    : 'http://192.155.92.17/images/eye.png',
                }}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>
            Password Strength: {passwordStrength}
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSignup}>
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
          <TouchableOpacity
            style={{ marginTop: 40 }}
            onPress={() => navigation.replace('Login')}
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

          <Image
            source={{ uri: 'http://192.155.92.17/images/bellow.png' }}
            style={{ height: 40, width: 69, marginTop: 60 }}
          />
        </View>
      </View>

      {/* Custom Message Component */}
      <CustomMessage
        visible={messageVisible}
        onClose={() => setMessageVisible(false)}
        message={messageText}
        duration={2000} // Optional: you can adjust the duration
      />
    </SafeAreaView>
  );
};

export default SignupScreen;
