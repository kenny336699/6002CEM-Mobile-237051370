import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomHeader from '../../common/CustomHeader';
import CityList from './CityList';

const CitiesScreen = ({route}) => {
  const {onSelectAttraction} = route.params;
  return (
    <View style={styles.container}>
      <CustomHeader title="City" back />
      <CityList onSelectAttraction={onSelectAttraction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CitiesScreen;
