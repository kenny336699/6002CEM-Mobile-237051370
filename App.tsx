import React, {useEffect, useState} from 'react';

import {StyleSheet} from 'react-native';

import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';

import StackNav from './src/navigation/StackNav';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';

import {fetchCitiesList} from './src/reducers/citiesReducer';
import {useAppDispatch, useAppSelector} from './src/store/hook';
import {PersistGate} from 'redux-persist/integration/react';
import auth from '@react-native-firebase/auth';
import {setLoading} from './src/reducers/appReducer';
import Loading from './src/common/Loading';
import {clearUser, setUserProfile} from './src/reducers/userReducer';
import {fetchTrips} from './src/reducers/tripReducer';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
const Root = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.app.loading);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, []);

  const onAuthStateChanged = user => {
    if (user) {
      dispatch(
        setUserProfile({email: user.email, displayName: user.displayName}),
      );
      dispatch(fetchTrips(user.email));
    } else {
      dispatch(clearUser());
    }

    if (loading) dispatch(setLoading(false));
  };

  useEffect(() => {
    dispatch(fetchCitiesList());
  }, []);
  return (
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <Loading />
        <StackNav />
      </NavigationContainer>
    </PersistGate>
  );
};

export default App;
