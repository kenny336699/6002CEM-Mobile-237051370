import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {useAppSelector} from '../../store/hook';
import Citys from './Cities';
import CustomHeader from '../../common/CustomHeader';

export default function CitiesScreen() {
  return (
    <View style={styles.container}>
      <CustomHeader title={'City'} back={false} />
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
