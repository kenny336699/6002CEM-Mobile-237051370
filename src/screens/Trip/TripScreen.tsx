import React from 'react';
import {View, Text, StyleSheet, FlatList, Pressable, Alert} from 'react-native';
import CustomHeader from '../../common/CustomHeader';
import FastImage from 'react-native-fast-image';
import {useAppSelector, useAppDispatch} from '../../store/hook';
import {NavigationProp} from '@react-navigation/native';
import {
  FirebaseFirestoreTypes,
  firebase,
} from '@react-native-firebase/firestore';
import {format} from 'date-fns';
import {Trip} from '../../type/trip';
import firebaseHelper from '../../firebase/firebaseHelper';
import {deleteTrip} from '../../reducers/tripReducer';

interface TripScreenProps {
  navigation: NavigationProp<any>;
}

const TripScreen: React.FC<TripScreenProps> = ({navigation}) => {
  const profile = useAppSelector(state => state.user.userProfile);
  const trips = useAppSelector(state => state.trips.trips);
  const dispatch = useAppDispatch();

  const calculateTotalDays = (
    startDate: FirebaseFirestoreTypes.Timestamp | null,
    endDate: FirebaseFirestoreTypes.Timestamp | null,
  ): string => {
    if (!startDate || !endDate) return 'N/A';

    const start = new Date(startDate.toDate().setHours(0, 0, 0, 0));
    const end = new Date(endDate.toDate().setHours(0, 0, 0, 0));

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates

    return `${diffDays} days`;
  };

  const confirmRemoveTrip = (tripId: string) => {
    Alert.alert(
      'Remove Trip',
      'Are you sure you want to remove this trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleRemoveTrip(tripId),
        },
      ],
      {cancelable: true},
    );
  };

  const handleRemoveTrip = async (tripId: string) => {
    try {
      await firebase.firestore().collection('trips').doc(tripId).delete();
      dispatch(deleteTrip(tripId)); // Update the Redux state
      Alert.alert('Success', 'Trip successfully removed.');
    } catch (error) {
      console.error('Error removing trip: ', error);
      Alert.alert('Error', 'Failed to remove trip.');
    }
  };

  const renderTrip = ({item}: {item: Trip}) => (
    <View style={styles.tripContainer}>
      <Pressable
        onPress={() => navigation.navigate('TripDetail', {tripData: item})}>
        <Text style={styles.tripName}>{item.trip_name}</Text>
        <Text style={styles.tripDate}>
          Start Date: {firebaseHelper.formatDate(item.start_date)}
        </Text>
        <Text style={styles.tripDate}>
          End Date: {firebaseHelper.formatDate(item.end_date)}
        </Text>
        <Text style={styles.tripDays}>
          Total Days: {calculateTotalDays(item.start_date, item.end_date)}
        </Text>
      </Pressable>
      <Pressable
        style={styles.removeButton}
        onPress={() => confirmRemoveTrip(item.id)}>
        <Text style={styles.removeButtonText}>Remove Trip</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screen}>
      <CustomHeader title="Trip" back={false} />
      {trips?.length > 0 ? (
        <FlatList
          data={trips}
          keyExtractor={trip => trip.id}
          renderItem={renderTrip}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <Pressable
                style={styles.button}
                onPress={() =>
                  navigation.navigate(profile ? 'CreateTrip' : 'Login')
                }>
                <Text style={styles.buttonText}>
                  {profile ? 'Create Trip' : 'Please Login'}
                </Text>
              </Pressable>
            </View>
          }
        />
      ) : (
        <View style={styles.noItemContainer}>
          <FastImage
            source={require('../../assets/images/plan/emptyPlans.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.noItemLabel}>No trips available</Text>
          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate(profile ? 'CreateTrip' : 'Login')
            }>
            <Text style={styles.buttonText}>
              {profile ? 'Create Trip' : 'Please Login'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tripContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tripDate: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  tripDays: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    fontWeight: '600',
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  noItemContainer: {
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
  },
  noItemLabel: {
    marginTop: 30,
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: '#f2e1e1',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#b22222',
    fontWeight: 'bold',
    fontSize: 20,
  },
  footerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default TripScreen;
