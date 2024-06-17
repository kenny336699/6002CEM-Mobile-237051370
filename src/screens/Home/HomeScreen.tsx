import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {useAppSelector} from '../../store/hook';
import Citys from '../City/CityList';
import HomeHeader from '../../common/HomeHeader';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeHeader />
      <Citys />
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
