import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_URL, ACCESS_TOKEN } from '@env'; // Import from .env
import axios from 'axios';
import CustomMessage from '../components/CustomMessage'; // Import CustomMessage
import { StackParams } from '../routes'; // Import your StackParams type
import CustomText from '../CustomText';

interface SignupScreenProps {
  navigation: StackNavigationProp<StackParams, 'Login'>; // Specific navigation type
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [securityNumber, setSecurityNumber] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isSplashVisible, setIsSplashVisible] = useState(true); // Splash screen state

  // CustomMessage state
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const splashTimeout = setTimeout(() => {
      setIsSplashVisible(false);
    }, 100);

    return () => clearTimeout(splashTimeout); // Clean up the timeout
  }, []);

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

  // Show splash screen while fonts are loading or splash is visible
  if (!fontsLoaded || isSplashVisible) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          flex: 1,
        }}
      >
        <StatusBar hidden={true} />
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', position: 'relative' }}
    >
      <StatusBar hidden={true} />
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
        <CustomText
          style={{
            color: 'white',
            fontSize: 24,
            fontFamily: 'Roboto_700Bold',
            top: 150,
          }}
        >
          BLACKUP
        </CustomText>
      </View>

      <View style={{ top: 250, marginHorizontal: 30 }}>
        {/* Security Number Input */}
        <View style={{ marginBottom: 20 }}>
          <CustomText
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Roboto_400Regular',
            }}
          >
            Security Number
          </CustomText>
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
              allowFontScaling={false}
              placeholderTextColor="gray"
              value={securityNumber}
              onChangeText={setSecurityNumber}
            />
          </View>
        </View>

        {/* Password Input */}
        <View>
          <CustomText
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Roboto_400Regular',
            }}
          >
            Password
          </CustomText>
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
              allowFontScaling={false}
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
          <CustomText style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>
            Password Strength: {passwordStrength}
          </CustomText>
        </View>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSignup}>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <CustomText
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
              </CustomText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 40 }}
            onPress={() => navigation.replace('Login')}
          >
            <CustomText
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'Roboto_400Regular',
              }}
            >
              have an account ?{' '}
              <CustomText style={{ color: 'lightblue' }}>Login</CustomText>
            </CustomText>
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
