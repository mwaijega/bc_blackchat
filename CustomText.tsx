// CustomText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';

// Create a CustomText component that disables font scaling globally
const CustomText: React.FC<TextProps> = (props) => {
  return <Text {...props} allowFontScaling={false} />;
};

export default CustomText;
