import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreenView() {
  return (
    <View style={styles.container}>
      <LottieView
        source={{
          uri: 'https://lottie.host/68cecb47-6a77-4846-a80c-a63918de8d22/0FYfXsqczT.json',
        }} // Remote Lottie URL
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
  },
});
