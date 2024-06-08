import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {useAppSelector} from '../../store/hook';
import Citys from '../City/Citiess';
import CustomHeader from '../../common/HomeHeader';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader />
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
