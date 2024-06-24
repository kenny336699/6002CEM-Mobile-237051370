import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {WeatherEntry} from '../../type/weather';
import getWeatherForecast from '../../api/weather';
import HomeHeader from '../../common/HomeHeader';
import WeatherComponent from '../../common/WeatherComponent';
import CityList from '../City/CityList';

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Could not get current location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      const weather = await getWeatherForecast(latitude, longitude);
      setWeatherData(weather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WeatherComponent weather={weatherData} />
      )}
      <CityList onSelectAttraction={undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
