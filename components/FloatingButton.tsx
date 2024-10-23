import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '../CustomText';

// Define the props type for the FloatingButton
interface FloatingButtonProps {
  onPress: () => void; // Type for onPress prop
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
  const translateY = useRef(new Animated.Value(100)).current; // Start off-screen

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0, // Move to the right position
      duration: 800, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start(); // Start the animation
  }, [translateY]);

  return (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ translateY }] }]}
    >
      <TouchableOpacity onPress={onPress} style={styles.floatingButton}>
        <CustomText style={styles.plusSign}>+</CustomText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 50, // Distance from the bottom
    right: '10%', // Center horizontally
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingButton: {
    width: 40, // Width and height for a circular button
    height: 40,
    borderRadius: 30, // Fully round
    backgroundColor: '#097', // Color similar to Samsung's floating action button
    justifyContent: 'center', // Center align the content vertically
    alignItems: 'center', // Center align the content horizontally
  },
  plusSign: {
    fontSize: 22, // Larger font for the "+" sign
    color: 'white', // White "+" sign
    fontWeight: 'bold', // Bold to make it stand out
  },
});

export default FloatingButton;
