import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
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
import firebaseHelper from '../../firebase/firebaseHelper';

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
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  useEffect(() => {
    if (tripData) {
      fetchAttractionDetails(tripData.days);
    }
  }, [tripData]);

  const fetchAttractionDetails = async (days: Trip['days']) => {
    try {
      setLoading(true);
      const attractionRefs = await firebaseHelper.fetchAttractionDetails(days);
      setAttractions(attractionRefs);
    } catch (error) {
      console.error('Error fetching attraction details: ', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDay = (index: number) => {
    // Implement the logic to delete the day from the tripData.days array and update the Firestore if necessary
    console.log(`Deleting day at index: ${index}`);
  };

  const renderDay = ({
    item,
    index,
  }: {
    item: {
      date: FirebaseFirestoreTypes.Timestamp | null;
      morning: FirebaseFirestoreTypes.DocumentReference | null;
      afternoon: FirebaseFirestoreTypes.DocumentReference | null;
    };
    index: number;
  }) => {
    const {date, morning, afternoon} = item;

    const morningAttraction = morning ? attractions.get(morning.id) : null;
    const afternoonAttraction = afternoon
      ? attractions.get(afternoon.id)
      : null;

    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteDay(index)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
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
              Start Date: {firebaseHelper.formatDate(tripData.start_date)}
            </Text>
            <Text style={styles.tripDate}>
              End Date: {firebaseHelper.formatDate(tripData.end_date)}
            </Text>
          </View>
          {tripData.days && tripData.days.length > 0 ? (
            <FlatList
              data={tripData.days.filter(day => day.date !== null)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderDay}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.noDaysContainer}>
              <Text style={styles.noDaysText}>No itinerary available</Text>
            </View>
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          /* Handle save action */
        }}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
    position: 'relative', // Needed for absolute positioning of delete button
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  listContent: {
    paddingBottom: 80, // To ensure Save button doesn't overlap with the list
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TripDetailScreen;
