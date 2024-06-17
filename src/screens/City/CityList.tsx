import React from 'react';
import {View, FlatList, Text, StyleSheet, Pressable} from 'react-native';
import {useAppSelector} from '../../store/hook';
import {City} from '../../type/city';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

const CityList: React.FC<{onSelectAttraction: Function}> = ({
  onSelectAttraction,
}) => {
  const locations = useAppSelector(state => state.cities.locations);
  const navigation = useNavigation();

  const navigateToCity = (id: number) => {
    navigation.navigate('City', {cityId: id, onSelectAttraction});
  };

  const renderCity = ({item}: {item: City}) => (
    <Pressable
      style={styles.cityContainer}
      onPress={() => {
        navigateToCity(item.id);
      }}>
      <Text style={styles.cityName}>{item.name}</Text>
      <FastImage source={{uri: item.image_url}} style={styles.cityImage} />
      <Text style={styles.cityDescription}>{item.description}</Text>
    </Pressable>
  );

  return (
    <FlatList
      data={locations}
      keyExtractor={item => item.id}
      renderItem={renderCity}
    />
  );
};

const styles = StyleSheet.create({
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
});

export default CityList;
