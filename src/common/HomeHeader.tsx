import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useAppDispatch, useAppSelector} from '../store/hook';
import {setUserProfile} from '../reducers/userReducer';
import firebaseHelper from '../firebase/firebaseHelper';

const HomeHeader = () => {
  const nav = useNavigation();
  const profile = useAppSelector(state => state.user.userProfile);
  const dispatch = useAppDispatch();
  console.log('profile', profile);
  const handleSignOut = async () => {
    try {
      firebaseHelper.firebaseLogout();
      dispatch(setUserProfile(null));
      nav.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../assets/images/icon/appIcon.png')}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Japan Travel</Text>
        {profile ? (
          <View>
            <Text>Welcome, {profile.displayName}</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignOut}>
              <Text style={styles.signInText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              nav.navigate('Login');
            }}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        )}
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
