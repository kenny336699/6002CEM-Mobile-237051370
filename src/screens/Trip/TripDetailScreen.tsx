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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Trip} from '../../type/trip';
import {Attraction} from '../../type/city';
import firebaseHelper from '../../firebase/firebaseHelper';
import CommonButton from '../../common/CommonButton';

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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartPicker, setIsStartPicker] = useState(true);
  const [trip, setTrip] = useState<Trip>(tripData);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
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
    // Implement the logic to delete the day from the tripData.days array and update Firestore if necessary
    console.log(`Deleting day at index: ${index}`);
  };

  const saveTrip = async () => {
    try {
      await firestore().collection('trips').doc(trip.id).update({
        start_date: trip.start_date,
        end_date: trip.end_date,
        days: trip.days, // Update the days array
      });
    } catch (error) {
      console.error('Error saving trip: ', error);
    }
  };

  const showDatePicker = (isStart: boolean) => {
    setIsStartPicker(isStart);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (isStartPicker) {
      setTrip(prevTrip => ({
        ...prevTrip,
        start_date: firestore.Timestamp.fromDate(date),
      }));
    } else {
      setTrip(prevTrip => ({
        ...prevTrip,
        end_date: firestore.Timestamp.fromDate(date),
      }));
    }
    hideDatePicker();
  };

  const handleAttractionSelected = async (
    dayIndex: number,
    attraction: Attraction,
    isMorning: boolean,
  ) => {
    try {
      const updatedDays = trip.days.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            [isMorning ? 'morning' : 'afternoon']: firestore()
              .collection('attractions')
              .doc(attraction.id),
          };
        }
        return day;
      });
      console.log('Updated days: ', updatedDays);
      setTrip(prevTrip => ({
        ...prevTrip,
        days: updatedDays,
      }));
      setAttractions(prevAttractions => {
        const newAttractions = new Map(prevAttractions);
        newAttractions.set(attraction.id, attraction);
        console.log(
          'Attraction selected and trip updated successfully.',
          newAttractions,
        );
        return newAttractions;
      });
      console.log('Attraction selected and trip updated successfully.');
    } catch (error) {
      console.error('Error updating attraction: ', error);
    }
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
                setSelectedDayIndex(index);
                navigation.navigate('Cities', {
                  onSelectAttraction: (attraction: Attraction) =>
                    handleAttractionSelected(index, attraction, true),
                });
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
                setSelectedDayIndex(index);
                navigation.navigate('Cities', {
                  onSelectAttraction: (attraction: Attraction) =>
                    handleAttractionSelected(index, attraction, false),
                });
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View style={styles.tripInfo}>
            <Pressable onPress={() => showDatePicker(true)}>
              <Text style={styles.tripDate}>
                Start Date: {firebaseHelper.formatDate(trip.start_date)}
              </Text>
            </Pressable>
            <Pressable onPress={() => showDatePicker(false)}>
              <Text style={styles.tripDate}>
                End Date: {firebaseHelper.formatDate(trip.end_date)}
              </Text>
            </Pressable>
          </View>
          {trip.days && trip.days.length > 0 ? (
            <FlatList
              data={trip.days.filter(day => day.date !== null)}
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
      <View style={styles.saveButtonContainer}>
        <CommonButton text={'Save'} onPress={saveTrip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between', // Ensure Save button is at the bottom
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
  saveButtonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9', // Match the background color
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
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
  footerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default TripDetailScreen;
