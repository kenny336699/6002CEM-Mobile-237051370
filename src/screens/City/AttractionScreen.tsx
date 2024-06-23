import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import getWeatherForecast from '../../api/weather';
import {WeatherEntry} from '../../type/weather';
import WeatherComponent from '../../common/WeatherComponent';
import CustomHeader from '../../common/CustomHeader';
import {useAppDispatch} from '../../store/hook';
import {setLoading} from '../../reducers/appReducer';

type AttractionScreenProps = {
  route: {
    params: {
      attraction: {
        id: string;
        name: string;
        image_url: string;
        description: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
      };
      onSelectAttraction: Function;
    };
  };
};

const AttractionScreen: React.FC<AttractionScreenProps> = ({
  route,
  navigation,
}) => {
  const {attraction, onSelectAttraction} = route.params;
  const [weather, setWeather] = useState<WeatherEntry[]>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchWeatherData();
  }, [attraction.coordinates.latitude, attraction.coordinates.longitude]);
  const fetchWeatherData = async () => {
    dispatch(setLoading(true));
    try {
      const weatherData = await getWeatherForecast(
        attraction.coordinates.latitude,
        attraction.coordinates.longitude,
      );
      weatherData.shift(); // Remove the current day's weather
      setWeather(weatherData);
    } catch (error) {
      console.error('Error getting weather data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <View style={styles.container}>
      <CustomHeader title={attraction.name} back />
      {weather && weather.length > 0 && <WeatherComponent weather={weather} />}
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{attraction.name}</Text>
        <Image source={{uri: attraction.image_url}} style={styles.image} />
        <Text style={styles.description}>{attraction.description}</Text>
        {onSelectAttraction && (
          <Pressable
            style={styles.addButton}
            onPress={() => {
              onSelectAttraction(attraction);
              navigation.goBack();
              navigation.goBack();
              navigation.goBack();
            }}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 16,
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
  description: {
    fontSize: 16,
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AttractionScreen;
