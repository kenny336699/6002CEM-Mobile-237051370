import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

const leftArrow = require('../assets/images/icon/Arrow_alt_left_alt.png');

interface CustomHeaderProps {
  title: string;
  back: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({title, back}) => {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      {back && (
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={styles.imageContainer}>
          <FastImage source={leftArrow} style={styles.image} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the children horizontally
    height: 56,
    backgroundColor: '#f8d7da',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    color: '#c21807',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'absolute', // Position the back button absolutely
    left: 16, // Adjust the left position as needed
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconContainer: {
    padding: 8,
  },
});

export default CustomHeader;
