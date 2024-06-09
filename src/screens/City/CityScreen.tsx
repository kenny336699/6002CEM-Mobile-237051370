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
import {City} from '../../type/city';
import {WeatherEntry} from '../../type/weather';
import WeatherComponent from '../../common/WeatherComponent';
import CustomHeader from '../../common/CustomHeader';
import {useAppDispatch} from '../../store/hook';
import {setLoading} from '../../reducers/appReducer';
import {useNavigation} from '@react-navigation/native';

type CityScreenProps = {
  route: {
    params: {
      cityId: string;
    };
  };
};

type Attraction = {
  id: string;
  name: string;
  image_url: string;
  description: string;
};

const CityScreen = ({route}: CityScreenProps) => {
  const {cityId} = route.params;
  const [city, setCity] = useState<City | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  const [weather, setWeather] = useState<WeatherEntry[]>();
  const dispatch = useAppDispatch();
  const nav = useNavigation();
  useEffect(() => {
    const fetchCityData = async () => {
      dispatch(setLoading(true));
      try {
        const cityDoc = await firestore()
          .collection('cities')
          .doc(cityId)
          .get();
        if (cityDoc.exists) {
          const cityData = cityDoc.data() as City;
          setCity(cityData);
          const attractionRefs = cityData.attractions || [];
          const attractionDocs = await Promise.all(
            attractionRefs.map(ref => ref.get()),
          );
          const attractionData = attractionDocs.map(
            doc => ({id: doc.id, ...doc.data()} as Attraction),
          );
          getWeatherForecast(
            cityData.coordinates.latitude,
            cityData.coordinates.longitude,
          ).then(weather => {
            weather.shift();
            setWeather(weather);
          });
          setAttractions(attractionData);
        }
      } catch (error) {
        console.error('Error getting city and attractions:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCityData();
  }, [cityId]);

  const renderItem = ({item}: {item: Attraction}) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => {
        nav.navigate('Attraction', {attraction: item});
      }}>
      <Text style={styles.title}>{item.name}</Text>
      <Image source={{uri: item.image_url}} style={styles.image} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title={city?.name || 'City'} back />
      {city && (
        <View style={styles.cityContainer}>
          <Text style={styles.cityDescription}>{city.description}</Text>
        </View>
      )}
      {weather && weather?.length > 0 && <WeatherComponent weather={weather} />}
      <FlatList
        data={attractions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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

export default CityScreen;
