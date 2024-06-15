import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../common/CustomHeader';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import {format} from 'date-fns';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Trip} from '../../type/trip';
import {Attraction} from '../../type/city';

interface TripDetailScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{params: {tripData: Trip}}, 'params'>;
}

const TripDetailScreen: React.FC<TripDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const {tripData} = route.params;
  const [attractions, setAttractions] = useState<Map<string, Attraction>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripData) {
      fetchAttractionDetails(tripData.days);
    }
  }, [tripData]);

  const fetchAttractionDetails = async (days: Trip['days']) => {
    try {
      const attractionRefs = [
        ...days.map(day => day.morning),
        ...days.map(day => day.afternoon),
      ].filter(
        (ref): ref is FirebaseFirestoreTypes.DocumentReference => ref !== null,
      );

      const attractionSnapshots = await Promise.all(
        attractionRefs.map(ref => ref.get()),
      );

      const attractionsMap = new Map<string, Attraction>();
      attractionSnapshots.forEach(doc => {
        const data = doc.data();
        if (data) {
          attractionsMap.set(doc.id, {
            id: doc.id,
            name: data.name,
            description: data.description,
            cityId: data.cityId,
            imageUrl: data.imageUrl,
            coordinates: data.coordinates,
          });
        }
      });

      setAttractions(attractionsMap);
    } catch (error) {
      console.error('Error fetching attraction details: ', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (
    date: FirebaseFirestoreTypes.Timestamp | null,
  ): string => {
    if (!date) return 'Invalid Date';

    try {
      return format(date.toDate(), 'dd MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date: ', error);
      return 'Invalid Date';
    }
  };

  const renderDay = ({
    item,
  }: {
    item: {
      date: FirebaseFirestoreTypes.Timestamp | null;
      morning: FirebaseFirestoreTypes.DocumentReference | null;
      afternoon: FirebaseFirestoreTypes.DocumentReference | null;
    };
  }) => (
    <View style={styles.dayContainer}>
      <Text style={styles.dayDate}>
        Date:{' '}
        {item.date
          ? format(item.date.toDate(), 'dd MMMM yyyy')
          : 'Unknown Date'}
      </Text>
      <Text style={styles.dayActivity}>
        Morning:{' '}
        {item.morning
          ? attractions.get(item.morning.id)?.name || 'Loading...'
          : 'No Activity'}
      </Text>
      <Text style={styles.dayActivity}>
        Afternoon:{' '}
        {item.afternoon
          ? attractions.get(item.afternoon.id)?.name || 'Loading...'
          : 'No Activity'}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <CustomHeader title="Trip Detail" back={true} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.tripInfo}>
            <Text style={styles.tripName}>
              {tripData.trip_name || 'Unnamed Trip'}
            </Text>
            <Text style={styles.tripDate}>
              Start Date: {formatDate(tripData.start_date)}
            </Text>
            <Text style={styles.tripDate}>
              End Date: {formatDate(tripData.end_date)}
            </Text>
          </View>
          {tripData.days && tripData.days.length > 0 ? (
            <FlatList
              data={tripData.days.filter(day => day.date !== null)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderDay}
            />
          ) : (
            <View style={styles.noDaysContainer}>
              <Text style={styles.noDaysText}>No itinerary available</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tripInfo: {
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  tripDate: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  dayContainer: {
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
  dayDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayActivity: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  noDaysContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDaysText: {
    fontSize: 18,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default TripDetailScreen;
