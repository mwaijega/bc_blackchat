import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number;
}

const { width } = Dimensions.get('window');

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  title,
  message,
  duration = 3000,
}) => {
  const [progress] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    if (visible) {
      playSound(); // Play sound when the alert becomes visible
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

  const getShortMessage = (msg: string) => {
    if (msg.includes('401')) return 'Authentication failed.';
    if (msg.includes('403')) return 'Access denied.';
    if (msg.includes('404')) return 'Resource not found.';
    if (msg.includes('999999999AURA')) return 'AURA level: 999999999!';
    return msg;
  };

  const getProgressColor = (msg: string) => {
    if (msg.includes('401') || msg.includes('403') || msg.includes('404')) {
      return '#FF3B30'; // Red for errors
    }
    return '#007AFF'; // Blue for normal messages
  };

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/alert_sound.mp3'), // Add your sound file here
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Unload sound when component unmounts
        }
      : undefined;
  }, [sound]);

  return (
    <Modal animationType="none" transparent={true} visible={visible}>
      <SafeAreaView style={styles.container}>
        {/* Blur background */}
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark">
          <Animated.View
            style={[
              styles.alertContainer,
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
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                  <Feather name="x" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.message}>{getShortMessage(message)}</Text>
            </View>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressBarWidth,
                  backgroundColor: getProgressColor(message), // Dynamic progress color
                },
              ]}
            />
          </Animated.View>
        </BlurView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: 'auto',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    marginHorizontal: 20,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  progressBar: {
    height: 3,
  },
});

export default CustomAlert;
