import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  SafeAreaView,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface CustomMessageProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  duration?: number; // Optional prop to auto-close after a specified time
}

const { width } = Dimensions.get('window');

const CustomMessage: React.FC<CustomMessageProps> = ({
  visible,
  onClose,
  message,
  duration = 2000, // Default duration for auto-close is 3 seconds
}) => {
  const [progress] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(progress, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(onClose);
        }, duration - 300);
      });
    }
  }, [visible]);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Success</Text>
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Progress Bar */}
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressBarWidth,
              },
            ]}
          />
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center', // Centers the message container horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
  },
  messageContainer: {
    width: width - 32,
    backgroundColor: 'black', // Green background for success message
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#8BC34A', // Lighter green for loading line
    marginTop: 10,
  },
});

export default CustomMessage;
