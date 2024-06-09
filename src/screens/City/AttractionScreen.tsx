import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import getWeatherForecast from '../../api/weather';
import {Attraction, City} from '../../type/city';
import {WeatherEntry} from '../../type/weather';
import WeatherComponent from '../../common/WeatherComponent';
import CustomHeader from '../../common/CustomHeader';
import {useAppDispatch} from '../../store/hook';
import {setLoading} from '../../reducers/appReducer';

type AttractionScreenProps = {
  route: {
    params: {
      attraction: Attraction;
    };
  };
};

const AttractionScreen = ({route}: AttractionScreenProps) => {
  const {attraction} = route.params;

  const [weather, setWeather] = useState<WeatherEntry[]>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchCityData = async () => {
      dispatch(setLoading(true));
      try {
        getWeatherForecast(
          attraction.coordinates.latitude,
          attraction.coordinates.longitude,
        ).then(weather => {
          weather.shift();
          setWeather(weather);
        });
      } catch (error) {
        console.error('Error getting city and attractions:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCityData();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title={attraction?.name || 'Attraction'} back />

      {weather && weather?.length > 0 && <WeatherComponent weather={weather} />}
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{attraction.name}</Text>
        <Image source={{uri: attraction.image_url}} style={styles.image} />
        <Text style={styles.description}>{attraction.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cityContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cityImage: {
    width: '100%',
    height: 200,
    marginBottom: 5,
  },
  cityDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 5,
  },
  weatherImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 16,
  },
});

export default AttractionScreen;
