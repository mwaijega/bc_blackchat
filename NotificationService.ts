// NotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ACCESS_TOKEN } from '@env';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// Interface for message response
interface MessageResponse {
  status: string;
  sender: string;
  message: string;
  time: string;
}

// Initialize notifications
export const initializeNotifications = async (): Promise<void> => {
  if (!Device.isDevice) {
    console.warn('Notifications are not available on simulator/emulator');
    return;
  }

  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

// Function to fetch message status from the backend
const fetchMessageStatus = async (): Promise<void> => {
  try {
    const token = await AsyncStorage.getItem('@access_token');
    if (!token) {
      console.warn('No access token found');
      return;
    }

    const response = await axios.get<MessageResponse>(
      `${API_URL}/message_status/?token=${token}`,
      {
        headers: {
          accept: 'application/json',
          access_token: ACCESS_TOKEN,
        },
      },
    );

    const data = response.data;
    if (data.status === 'Message exists') {
      await triggerNotification(data.sender, data.message, data.time);
    }
  } catch (error) {
    console.error('Error fetching message status:', error);
  }
};

// Function to trigger a local notification
const triggerNotification = async (
  sender: string,
  message: string,
  time: string,
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `New message from ${sender}`,
        body: `${message} received at ${time}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { sender, message, time },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Failed to trigger notification:', error);
  }
};

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    await fetchMessageStatus();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Set up background fetch
export const setupBackgroundFetch = async (): Promise<void> => {
  try {
    // Register the task
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60, // 15 minutes in seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log('Background fetch task registered');
  } catch (error) {
    console.error('Failed to register background fetch:', error);
  }
};

// Call this function to start background fetch
export const startBackgroundFetch = async (): Promise<void> => {
  await setupBackgroundFetch();
};
