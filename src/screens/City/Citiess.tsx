import React from 'react';
import {View, FlatList, Text, Image, StyleSheet, Pressable} from 'react-native';
import {useAppSelector} from '../../store/hook';
import {City} from '../../type/city';
import firebaseHelper from '../../firebase/firebaseHelper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const Citys: React.FC = () => {
  const locations = useAppSelector(state => state.cities.locations);
  const navigation = useNavigation();
  console.log('locations:', locations);
  const navigateToAttractions = id => {
    navigation.navigate('Attractions', {cityId: id});
  };
  const renderCity = ({item}: {item: City}) => (
    <Pressable
      style={styles.cityContainer}
      onPress={() => {
        navigateToAttractions(item.id);
      }}>
      <Text style={styles.cityName}>{item.name}</Text>
      <FastImage source={{uri: item.image_url}} style={styles.cityImage} />
      <Text style={styles.cityDescription}>{item.description}</Text>
    </Pressable>
  );

  if (!locations || locations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No cities available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={locations}
      keyExtractor={item => item.id}
      renderItem={renderCity}
    />
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
