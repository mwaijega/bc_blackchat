import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParams } from '../routes'; // Import your StackParams type
import CustomText from '../CustomText';

// Define the props type
interface WelcomeScreenProps {
  navigation: StackNavigationProp<StackParams, 'Welcome'>; // Specific navigation type
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  // Load fonts asynchronously
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  // Splash screen timeout effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  // Show splash screen while fonts are loading or the splash is active
  if (!fontsLoaded || isShowSplash) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar hidden={true} />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/logo_two.png' }}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
        <Image
          source={{ uri: 'http://192.155.92.17/images/logo_two.png' }}
          style={{ width: 200, height: 200 }} // Adjust size as needed
        />
        <CustomText
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
        </CustomText>
        <View style={{ marginTop: 80 }}>
          <TouchableOpacity
            id="login"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 17,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignItems: 'center',
              marginTop: 20,
              height: 61,
              width: 290,
              justifyContent: 'center',
            }}
            onPress={() => navigation.replace('Login')}
          >
            <CustomText
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              LOGIN
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            id="register"
            style={{
              backgroundColor: 'white',
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 17,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignItems: 'center',
              marginTop: 20,
              height: 61,
              width: 290,
              justifyContent: 'center',
            }}
            onPress={() => navigation.replace('Signup')}
          >
            <CustomText
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
              }}
            >
              SIGN UP
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
