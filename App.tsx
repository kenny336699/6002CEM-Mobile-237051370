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
import Citys from './src/screens/citys';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/LoginScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StackNav from './src/navigation/StackNav';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const [text, setText] = React.useState<string>('21321312');
  const isDarkMode = useColorScheme() === 'dark';
  const [cities, setCities] = useState([]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesCollection = await firestore().collection('cities').get();
        const citiesData = citiesCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities: ', error);
      }
    };

    fetchCities();
  }, []);

  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}

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
