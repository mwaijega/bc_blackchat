import { View, Image } from 'react-native';

export default function SplashScreenView() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View>
        <Image
          source={require('./assets/icon.png')}
          style={{ height: 100, width: 100 }}
        />
      </View>
    </View>
  );
}
