import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, StyleSheet, Pressable} from 'react-native';
import {City} from '../../type/city';
import {WeatherEntry} from '../../type/weather';
import WeatherComponent from '../../common/WeatherComponent';
import CustomHeader from '../../common/CustomHeader';
import {useAppDispatch} from '../../store/hook';
import {setLoading} from '../../reducers/appReducer';
import {useNavigation} from '@react-navigation/native';
import firebaseHelper from '../../firebase/firebaseHelper';

type CityScreenProps = {
  route: {
    params: {
      cityId: number;
      onSelectAttraction: Function;
    };
  };
};

type Attraction = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const CityScreen: React.FC<CityScreenProps> = ({route}) => {
  const {cityId, onSelectAttraction} = route.params;
  const [city, setCity] = useState<City | null>(null);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [weather, setWeather] = useState<WeatherEntry[]>();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCityData = async () => {
      dispatch(setLoading(true));
      try {
        const {cityData, attractionData, weather} =
          await firebaseHelper.fetchCityWithAttractions(cityId.toString());
        setCity(cityData);
        setAttractions(attractionData);
        setWeather(weather);
      } catch (error) {
        console.log('Error getting city and attractions:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCityData();
  }, [cityId, dispatch]);

  const renderItem = ({item}: {item: Attraction}) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate('Attraction', {
          attraction: item,
          onSelectAttraction,
        });
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
      {weather && weather.length > 0 && <WeatherComponent weather={weather} />}
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
});

export default CityScreen;
