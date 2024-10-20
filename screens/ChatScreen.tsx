import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import { API_URL, ACCESS_TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParams } from '../routes';

interface ChatScreenProps extends StackScreenProps<StackParams, 'Chat'> {}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { sender } = route.params;
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; decrypted_message: string; received_at: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setChatMessages(response.data.messages);
        return 2000; // Reset to 2 seconds on new message
      } else {
        return Math.min(backoffInterval * 2, 30000); // Increase interval
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return Math.min(backoffInterval * 2, 30000);
    }
  };

  const sendMessage = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('@access_token');
    if (!token) {
      console.error('No valid session found.');
      return;
    }

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

  useEffect(() => {
    let backoffInterval = 2000;
    let intervalId: NodeJS.Timeout;

    const startPolling = async () => {
      const newBackoffInterval = await fetchMessages(backoffInterval);
      backoffInterval = newBackoffInterval ?? backoffInterval;
      intervalId = setTimeout(startPolling, backoffInterval);
    };

    startPolling();

    return () => clearTimeout(intervalId);
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'black' }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 10,
        }}
      >
        Chat with {sender}
      </Text>

      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {chatMessages.map((msg, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text
              style={{ fontSize: 14, fontWeight: 'bold', color: 'lightblue' }}
            >
              {msg.sender}
            </Text>
            <Text style={{ fontSize: 16, color: 'white' }}>
              {msg.decrypted_message}
            </Text>
            <Text
              style={{ fontSize: 12, color: 'gray', alignSelf: 'flex-end' }}
            >
              {msg.received_at}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
          color: 'white',
          marginBottom: 10,
        }}
        placeholder="Type a message"
        placeholderTextColor="gray"
        value={newMessage}
        onChangeText={setNewMessage}
        editable={!isLoading}
      />

      <Button
        title="Send"
        onPress={sendMessage}
        disabled={isLoading || newMessage === ''}
      />
    </View>
  );
};

export default ChatScreen;
