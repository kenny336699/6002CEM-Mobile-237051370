import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAppSelector} from '../store/hook';

interface Props {
  isLoading?: boolean | undefined;
}

const Loading = (props: Props) => {
  const isLoad = useAppSelector(state => state.app?.loading);
  let isloading: boolean = props?.isLoading ?? false;
  if (!props?.isLoading) {
    if (typeof isLoad === 'boolean') {
      isloading = isLoad;
    } else {
      isloading = isLoad?.loading ?? false;
    }
  }
  const isShowGlobalLoading = !props?.isLoading
    ? isLoad?.isShowGlobalLoading ?? true
    : true;
  return isloading && isShowGlobalLoading ? (
    <View style={styles.root}>
      <View style={styles.boxView}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxView: {
    width: 100,
    height: 100,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.39,
    shadowRadius: 2,
    elevation: 13,
    backgroundColor: '#FCFCFC',
  },
});

export default Loading;
