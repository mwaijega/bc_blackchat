import React, { useEffect, useState } from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParams } from '../routes';

interface MessageCardProps {
  name: string;
  recipient: string; // recipient is passed as a prop to dynamically fetch messages
}

const MessageCard: React.FC<MessageCardProps> = ({ name, recipient }) => {
  const navigation = useNavigation<StackNavigationProp<StackParams>>();
  const [lastMessage, setLastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const API_URL = await AsyncStorage.getItem('API_URL'); // Get API URL from storage
        const ACCESS_TOKEN = await AsyncStorage.getItem('SIGNIN_TOKEN'); // Get SIGNIN_TOKEN from login
        const response = await fetch(`${API_URL}/receive/${recipient}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setLastMessage(data.decrypted_message);
        } else {
          setLastMessage('No message available');
        }
      } catch (error) {
        console.error('Error fetching message:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastMessage();
  }, [recipient]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { name })}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          backgroundColor: '#D9D9D923',
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'gray',
            height: 50,
            width: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/pro.png' }}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
              {name}
            </Text>
            <Text style={{ color: 'white', fontSize: 12 }}>10:30 AM</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            {isLoading ? (
              <Text style={{ color: 'white', fontSize: 12 }}>Loading...</Text>
            ) : (
              <Text style={{ color: 'white', fontSize: 12 }}>
                {lastMessage}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;
