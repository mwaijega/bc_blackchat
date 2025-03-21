import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import FloatingButton from '../components/FloatingButton';
import { StackParams } from '../routes';
import axios from 'axios';
import { ACCESS_TOKEN, API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';
import CustomText from '../CustomText';

interface HomeScreenProps {
  navigation: StackNavigationProp<StackParams, 'Home'>;
}

interface MessageStatus {
  status: string;
  sender: string;
  time: string;
  message: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const [messageStatus, setMessageStatus] = useState<MessageStatus | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let backoffInterval = 2000; // Start with 2 seconds

    const fetchMessageStatus = async () => {
      const token = await AsyncStorage.getItem('@access_token');

      if (!token) {
        setAlertMessage('No valid session found. Please log in first.');
        setAlertVisible(true);
        setIsLoading(false);
        return;
      }

      try {
        const statusResponse = await axios.get(
          `${API_URL}/message_status?token=${token}`,
          {
            headers: {
              Accept: 'application/json',
              access_token: ACCESS_TOKEN,
            },
          },
        );

        if (statusResponse.data.status === 'Message exists') {
          setMessageStatus(statusResponse.data); // Update message status
          backoffInterval = 2000; // Reset backoff if message exists
        } else {
          setMessageStatus(null);
        }
      } catch (error) {
        console.error('Error checking message status:', error);
        setAlertMessage('Error checking message status.');
        setAlertVisible(true);
      } finally {
        setIsLoading(false);
        // Clear the previous interval and set up the new one with backoff
        clearTimeout(intervalId);
        intervalId = setTimeout(fetchMessageStatus, backoffInterval);
      }
    };

    // Initial fetch
    fetchMessageStatus();

    // Cleanup on unmount
    return () => clearTimeout(intervalId);
  }, []);

  const handleFloatingButtonPress = () => {
    setRecipientModalVisible(true);
  };

  const handleRecipientSubmit = () => {
    if (recipient.trim() === '') {
      setAlertMessage('Please enter a valid recipient name.');
      setAlertVisible(true);
      return;
    }
    setRecipientModalVisible(false);
    navigation.navigate('Chat', { sender: recipient, message: '' });
    setRecipient('');
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          flex: 1,
        }}
      >
        <StatusBar hidden={true} />
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}
      >
        <Image
          source={{ uri: 'http://192.155.92.17/images/sms.png' }}
          style={{ height: 300, width: 300 }}
        />
      </View>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#D9D9D923',
          marginHorizontal: 20,
          borderRadius: 10,
          marginTop: 20,
          paddingHorizontal: 10,
          paddingBottom: 20,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {messageStatus ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', {
                sender: messageStatus.sender,
                message: messageStatus.message,
              })
            }
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
                style={{ height: 40, width: 40, borderRadius: 20 }}
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
                <CustomText
                  style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}
                >
                  {messageStatus.sender}
                </CustomText>
                <CustomText style={{ color: 'white', fontSize: 12 }}>
                  {messageStatus.time}
                </CustomText>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}
              >
                <CustomText style={{ color: 'white', fontSize: 12 }}>
                  {messageStatus.message}
                </CustomText>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <CustomText
            style={{ color: 'white', textAlign: 'center', marginTop: 20 }}
          >
            No new messages
          </CustomText>
        )}
      </ScrollView>

      <FloatingButton onPress={handleFloatingButtonPress} />

      {/* Modal to input recipient name */}
      <Modal
        visible={recipientModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRecipientModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <CustomText style={styles.modalTitle}>Enter Recipient</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Recipient name"
              placeholderTextColor="#aaa"
              allowFontScaling={false}
              value={recipient}
              onChangeText={setRecipient}
            />
            <View
              style={{
                flexDirection: 'row',
                gap: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#fff4',
                  borderRadius: 10,
                }}
                onPress={handleRecipientSubmit}
              >
                <CustomText style={{ color: 'white' }}>SUBMIT</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: '#fff4',
                  borderRadius: 10,
                }}
                onPress={() => setRecipientModalVisible(false)}
              >
                <CustomText style={{ color: 'white' }}>CANCEL</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        title={''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    color: 'white',
  },
});

export default HomeScreen;
