import React from 'react';
import { Text, View, ActivityIndicator, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import MessageCard from '../components/MessageCard';
import FloatingButton from '../components/FloatingButton';
import { StackParams } from '../routes'; // Import StackParams

// Define props for HomeScreen
interface HomeScreenProps {
  navigation: StackNavigationProp<StackParams, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#ffffff" />;
  }

  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 150,
        }}
      >
        <Image
          source={{ uri: 'http://192.155.92.17/images/sms.png' }}
          style={{ height: 300, width: 300 }}
        />
      </View>

      <ScrollView
        style={{
          width: 'auto',
          backgroundColor: '#D9D9D923',
          marginHorizontal: 20,
          borderRadius: 10,
          marginTop: 150,
          paddingHorizontal: 10,
          paddingBottom: 200,
        }}
      >
        <MessageCard name="John Doe" />
        <MessageCard name="Jane Smith" />
        <MessageCard name="Nsumba ntale" />
        <MessageCard name="Robert John" />
        <MessageCard name="Lautaro" />
        <MessageCard name="Keneth" />
        <MessageCard name="Mulla" />
      </ScrollView>

      {/* Floating Button to navigate to ChatScreen */}
      <FloatingButton
        onPress={() => {
          navigation.navigate('Chat', { name: 'New Recipient' }); // Pass 'name' prop to ChatScreen
        }}
      />
    </View>
  );
};

export default HomeScreen;
