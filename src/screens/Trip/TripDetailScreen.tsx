import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import CustomHeader from '../../common/CustomHeader';
import {
  RouteProp,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
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
  const nav = useNavigation();

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
            image_url: data.image_url,
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
  }) => {
    const {date, morning, afternoon} = item;

    const morningAttraction = morning ? attractions.get(morning.id) : null;
    const afternoonAttraction = afternoon
      ? attractions.get(afternoon.id)
      : null;

    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayDate}>
          Date: {date ? format(date.toDate(), 'dd MMMM yyyy') : 'Unknown Date'}
        </Text>

        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            Morning:{' '}
            {morning ? morningAttraction?.name || 'Loading...' : 'No Activity'}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => {
                if (morningAttraction) {
                  navigation.navigate('Attraction', {
                    attraction: morningAttraction,
                  });
                }
              }}>
              <Text style={styles.buttonText}>View</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                if (morningAttraction) {
                  navigation.navigate('EditAttraction', {
                    attraction: morningAttraction,
                  });
                }
              }}>
              <Text style={styles.buttonText}>Change</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            Afternoon:{' '}
            {afternoon
              ? afternoonAttraction?.name || 'Loading...'
              : 'No Activity'}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.button}
              onPress={() => {
                if (afternoonAttraction) {
                  navigation.navigate('Attraction', {
                    attraction: afternoonAttraction,
                  });
                }
              }}>
              <Text style={styles.buttonText}>View</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                if (afternoonAttraction) {
                  navigation.navigate('EditAttraction', {
                    attraction: afternoonAttraction,
                  });
                }
              }}>
              <Text style={styles.buttonText}>Change</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

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
    marginBottom: 10,
  },
  activityContainer: {
    marginBottom: 10,
  },
  activityText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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
