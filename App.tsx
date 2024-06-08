/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import Citys from './src/screens/City/Citiess';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/LoginScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNav from './src/navigation/StackNav';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';

import {fetchCitiesList} from './src/reducers/citiesReducer';
import {useAppDispatch, useAppSelector} from './src/store/hook';
import {PersistGate} from 'redux-persist/integration/react';
import auth from '@react-native-firebase/auth';
import {setLoading} from './src/reducers/appReducer';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
const Root = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.app.loading);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = user => {
    if (loading) dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(fetchCitiesList());
  }, []);
  return (
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </PersistGate>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  cityDescription: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
export default App;
