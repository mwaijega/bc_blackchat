import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { storeToken, retrieveToken } from '../tokenStorage'; // Add retrieveToken function
import { API_URL, ACCESS_TOKEN } from '@env';
import CustomAlert from '../components/CustomAlert';
import CustomMessage from '../components/CustomMessage';
import { StackParams } from '../routes';
import { StackNavigationProp } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

interface LoginScreenProps {
  navigation: StackNavigationProp<StackParams, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [securityNumber, setSecurityNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [messageVisible, setMessageVisible] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = async () => {
    if (!securityNumber || !password) {
      setAlertMessage('Please fill out all fields.');
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/token`,
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
        const { access_token } = response.data;
        await storeToken(access_token); // Store the token
        setSuccessMessage('Login Successful. Welcome back!');
        setMessageVisible(true);
        navigation.replace('Home', { token: access_token });
      }
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';

      if (error instanceof Error) {
        errorMessage = `Login failed: ${error.message}`;
      } else if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Login failed: ${JSON.stringify(error.response.data)}`;
      }

      setAlertMessage(errorMessage);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with fingerprint',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        const token = await retrieveToken(); // Retrieve stored token
        if (token) {
          setSuccessMessage('Fingerprint Authentication Successful!');
          setMessageVisible(true);
          navigation.replace('Home', { token }); // Navigate with the token
        } else {
          setAlertMessage('No valid session found. Please log in first.');
          setAlertVisible(true);
        }
      } else {
        setAlertMessage('Fingerprint authentication failed.');
        setAlertVisible(true);
      }
    } else {
      setAlertMessage(
        'Fingerprint authentication is not available or not enrolled.',
      );
      setAlertVisible(true);
    }
  };

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
          BLACKING
        </Text>
      </View>

      <View style={{ top: 250, marginHorizontal: 30 }}>
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
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
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
        </View>

        <View style={{}}>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{ marginLeft: 5 }}
            >
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                {loading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontFamily: 'Roboto_700Bold',
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 17,
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                    }}
                  >
                    Login
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFingerprintLogin}
              style={{
                marginTop: 20,
                borderRadius: 100,
                paddingVertical: 0,
                paddingHorizontal: 0,
                backgroundColor: 'transparent', // Light blue with transparency

                borderWidth: 2,
                elevation: 5, // Shadow for Android
                shadowColor: '#000', // Shadow for iOS
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 100,
                flexDirection: 'row', // Align items in a row
                alignItems: 'center', // Center vertically
                marginRight: 5,
              }}
            >
              <Image
                source={{ uri: 'http://192.155.92.17/images/bio.png' }} // Replace with your actual IP address
                style={{
                  width: 40, // Adjust width as needed
                  height: 40, // Adjust height as needed
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.replace('Signup')}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                fontFamily: 'Roboto_400Regular',
              }}
            >
              Don't have an account?{' '}
              <Text style={{ color: 'lightblue' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Image
              source={{ uri: 'http://192.155.92.17/images/bellow.png' }}
              style={{ height: 40, width: 69 }}
            />
          </View>
        </View>

        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
          title={''}
        />
        <CustomMessage
          visible={messageVisible}
          message={successMessage}
          onClose={() => setMessageVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
