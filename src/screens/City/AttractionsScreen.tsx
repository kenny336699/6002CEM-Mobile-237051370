import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import getWeatherForecast from '../../api/weather';
import {City} from '../../type/city';
const AttractionsScreen = ({route}) => {
  const {cityId} = route.params;
  const [city, setCity] = useState<City | null>(null);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const cityDoc = await firestore()
          .collection('cities')
          .doc(cityId)
          .get();
        if (cityDoc.exists) {
          const cityData: City = cityDoc.data();
          setCity(cityData);
          const attractionRefs = cityData.attractions || [];
          const attractionDocs = await Promise.all(
            attractionRefs.map(ref => ref.get()),
          );
          const attractionData = attractionDocs.map(doc => doc.data());
          getWeatherForecast(
            cityData.coordinates.latitude,
            cityData.coordinates.longitude,
          ).then(weather => {});
          setAttractions(attractionData);
        }
      } catch (error) {
        console.error('Error getting city and attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [cityId]);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Image source={{uri: item.image_url}} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {city && (
        <View style={styles.cityContainer}>
          <Text style={styles.cityName}>{city.name}</Text>

          <Text style={styles.cityDescription}>{city.description}</Text>
        </View>
      )}
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
  description: {
    fontSize: 16,
  },
});

export default AttractionsScreen;
