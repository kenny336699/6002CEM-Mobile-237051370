import {View, FlatList, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
const Citys = () => {
  const [cities, setCities] = useState([]);
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
    <View style={styles.container}>
      <FlatList
        data={cities}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.cityContainer}>
            <Text style={styles.cityName}>{item.name}</Text>
            <Image source={{uri: item.image_url}} style={styles.cityImage} />
            <Text style={styles.cityDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
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
export default Citys;
