import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import { API_URL, ACCESS_TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParams } from '../routes';
import CustomText from '../CustomText';

interface ChatScreenProps extends StackScreenProps<StackParams, 'Chat'> {}

// Import statements remain the same

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { sender } = route.params;
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; decrypted_message: string; received_at: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let intervalId: NodeJS.Timeout;

  // Helper function to format the received_at timestamp
  const formatReceivedAt = (date: Date) => {
    const now = new Date();
    const diffInTime = now.getTime() - date.getTime();
    const diffInHours = diffInTime / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInDays < 1) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(); // Format as MM/DD/YYYY
    }
  };

  // Function to parse the received_at string safely
  const parseReceivedAt = (receivedAt: string) => {
    const parsedDate = new Date(receivedAt);
    // If the date is invalid, try parsing it with Date.parse
    if (isNaN(parsedDate.getTime())) {
      const timestamp = Date.parse(receivedAt);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }

      return new Date(); // Return current date as fallback
    }
    return parsedDate;
  };

  // Function to fetch new messages from the server
  const fetchMessages = async (backoffInterval: number) => {
    try {
      const token = await AsyncStorage.getItem('@access_token');
      if (!token) {
        console.error('No valid session found.');
        return;
      }

      const response = await axios.get(`${API_URL}/receive/?token=${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          access_token: ACCESS_TOKEN,
        },
      });

      if (response.data.messages && response.data.messages.length > 0) {
        setChatMessages((prevMessages) => {
          const newMessages = response.data.messages
            .filter(
              (msg: { received_at: string }) =>
                !prevMessages.some((m) => m.received_at === msg.received_at),
            )
            .map((msg: { received_at: string }) => ({
              ...msg,
              received_at: formatReceivedAt(parseReceivedAt(msg.received_at)),
            }));
          return [...prevMessages, ...newMessages];
        });
        return 2000; // Reset to 2 seconds on new message
      } else {
        return Math.min(backoffInterval * 2, 3000); // Increase interval
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return;
      }
      console.error('Error fetching messages:', error);
      return Math.min(backoffInterval * 2, 3000);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('@access_token');
    if (!token) {
      console.error('No valid session found.');
      return;
    }

    const newChatMessage = {
      sender: 'Me', // Local indication of the sender
      decrypted_message: newMessage,
      received_at: formatReceivedAt(new Date()), // Use the formatting function here
    };

    // Immediately update the chat with the new message
    setChatMessages((prevMessages) => [...prevMessages, newChatMessage]);

    try {
      await axios.post(
        `${API_URL}/send/?token=${token}`,
        {
          recipient: sender,
          encrypted_message: newMessage,
          expires_in: 3600,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            access_token: ACCESS_TOKEN,
          },
        },
      );
      setNewMessage('');
      await fetchMessages(2000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling effect for fetching new messages
  useEffect(() => {
    let backoffInterval = 2000;

    const startPolling = async () => {
      const newBackoffInterval = await fetchMessages(backoffInterval);
      backoffInterval = newBackoffInterval ?? backoffInterval;
      intervalId = setTimeout(startPolling, backoffInterval);
    };

    startPolling();

    // Cleanup function to clear interval when the screen is unmounted
    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
        console.log('Polling stopped, connection terminated.');
      }
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'gray',
            height: 30,
            width: 30,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/pro.png' }}
            style={{ height: 20, width: 20, borderRadius: 20 }}
          />
        </View>
        <CustomText
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 10,
          }}
        >
          {sender}
        </CustomText>
      </View>

      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {chatMessages.map((msg, index) => (
          <View
            key={index}
            style={{
              marginBottom: 15,
              padding: 10,
              borderRadius: 17,
              maxWidth: '80%',
              alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'Me' ? '#fff5' : '#fff2',
            }}
          >
            <CustomText style={{ fontSize: 16, color: 'white' }}>
              {msg.decrypted_message}
            </CustomText>
            <CustomText
              style={{ fontSize: 12, color: 'gray', textAlign: 'right' }}
            >
              {msg.received_at}
            </CustomText>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextInput
          style={{
            height: 50,
            width: '80%',
            borderRadius: 15,
            borderColor: 'gray',
            backgroundColor: '#0004',
            borderWidth: 1,
            paddingHorizontal: 10,
            color: 'white',
            marginBottom: 10,
          }}
          placeholder="Type a message..."
          allowFontScaling={false}
          placeholderTextColor="gray"
          value={newMessage}
          onChangeText={setNewMessage}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={isLoading || newMessage === ''}
          style={{
            alignItems: 'center',
            height: 50,
          }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/send.png' }}
            style={{
              height: 40,
              width: 40,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
