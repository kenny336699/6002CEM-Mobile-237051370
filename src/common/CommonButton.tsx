// src/components/CommonButton.tsx

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface CommonButtonProps extends PressableProps {
  text: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  text,
  onPress,
  buttonStyle,
  textStyle,
  ...props
}) => {
  return (
    <Pressable
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      {...props}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '80%',
    backgroundColor: '#f2e1e1',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#b22222',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default CommonButton;
