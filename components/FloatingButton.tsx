import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Define the props type for the FloatingButton
interface FloatingButtonProps {
  onPress: () => void; // Type for onPress prop
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
  const translateX = useRef(new Animated.Value(100)).current; // Start off-screen

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0, // Move to the right position
      duration: 800, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start(); // Start the animation
  }, [translateX]);

  return (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ translateX }] }]}
    >
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>🚀 Login with Fingerprint</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50, // Adjust the vertical position
    right: 20, // Fixed position from the right
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: 'black', // Black background
    borderColor: 'lightblue',
    borderWidth: 2,
  },
  buttonText: {
    color: 'lightblue', // Light blue text color
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
  },
});

export default FloatingButton;
