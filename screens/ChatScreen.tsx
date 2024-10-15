import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParams } from '../routes'; // Adjust the import based on your project structure

// Define props for ChatScreen using StackNavigationProp and RouteProp
interface ChatScreenProps {
  navigation: StackNavigationProp<StackParams, 'Chat'>;
  route: RouteProp<StackParams, 'Chat'>;
}

// Sample message data structure
interface Message {
  id: number;
  text: string;
  sender: 'out' | 'in'; // 'out' for messages sent by the user, 'in' for received messages
  timestamp: string; // New field for message timestamp
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [name, setName] = useState(route.params.name); // Editable username state
  const [message, setMessage] = useState(''); // State for the current message input

  // Sample messages
  const messages: Message[] = [
    { id: 1, text: 'Hello!', sender: 'in', timestamp: '10:30 AM' },
    { id: 2, text: 'How are you?', sender: 'out', timestamp: '10:31 AM' },
    { id: 3, text: 'I am good, thanks!', sender: 'in', timestamp: '10:32 AM' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 10 }}>
      {/* Header with editable username and profile picture */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
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
            style={{
              height: 20,
              width: 20,
              borderRadius: 20,
            }}
          />
        </View>
        <TextInput
          value={name}
          onChangeText={setName} // Update name state on text change
          placeholder="Enter your name"
          placeholderTextColor="#888"
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 5,
            padding: 5,
          }}
        />
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === 'out' ? 'flex-end' : 'flex-start',
              backgroundColor: item.sender === 'out' ? '#007AFF' : '#555555',
              borderRadius: 10,
              padding: 10,
              marginVertical: 5,
              maxWidth: '80%',
            }}
          >
            <Text style={{ color: 'white' }}>{item.text}</Text>
            <Text style={{ color: '#ccc', fontSize: 10, marginTop: 5 }}>
              {item.timestamp} {/* Displaying the timestamp */}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
        style={{ flexGrow: 1 }} // Allow FlatList to expand
      />

      {/* Input Area */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10, // Adding margin above input area
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage} // Update message state on text change
          placeholder="Type a message..."
          placeholderTextColor="#888"
          style={{
            flex: 1,
            backgroundColor: 'rgba(51, 51, 51, 0.8)', // Semi-transparent input background
            borderRadius: 20,
            padding: 10,
            color: 'white',
          }}
        />
        <TouchableOpacity
          onPress={() => {
            // Handle send message logic
            if (message.trim()) {
              // Add your send message logic here
              console.log(`Sending message: ${message}`);
              setMessage(''); // Clear the input after sending
            }
          }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/send.png' }}
            style={{ height: 30, width: 30, marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
