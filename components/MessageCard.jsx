import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessageCard = ({ name }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { name })}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          backgroundColor: '#D9D9D923',
          padding: 10,
          borderRadius: 10,
          alignItems: 'center', // Centers content vertically
        }}
      >
        <View
          style={{
            backgroundColor: 'gray',
            height: 50,
            width: 50,
            borderRadius: 25, // Full circle for profile image
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15, // Adds spacing between the image and text
          }}
        >
          <Image
            source={{ uri: 'http://192.155.92.17/images/pro.png' }}
            style={{
              height: 40,
              width: 40,
              borderRadius: 20, // Round the image inside
            }}
          />
        </View>

        {/* Right side with name and message info */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center', // Aligns items in the center vertically
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
              marginTop: 5, // Space between name and message count
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              Last message preview...
            </Text>
            <Text
              style={{
                backgroundColor: 'gray',
                borderRadius: 50,
                paddingHorizontal: 8,
                paddingVertical: 3,
                fontSize: 10,
                color: 'white',
              }}
            >
              1
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;
