import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const HomeHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../assets/images/icon/appIcon.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Japan Travel</Text>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
    width: '100%',
    backgroundColor: '#f8d7da',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    color: '#c21807',
    fontWeight: 'bold',
  },
  signInButton: {
    backgroundColor: '#e29a9a',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 10,
  },
  signInText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default HomeHeader;
