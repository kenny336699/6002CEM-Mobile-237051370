import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch} from 'react-redux';

import {Trip, Day, Attraction} from '../../type/trip';
import CommonButton from '../../common/CommonButton';
import CustomHeader from '../../common/CustomHeader';
import {useAppSelector} from '../../store/hook';
import {addTrip} from '../../reducers/tripReducer';

const AddTripScreen: React.FC = () => {
  const [tripName, setTripName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [isStartPicker, setIsStartPicker] = useState<boolean>(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useAppSelector(state => state.user.userProfile);
  const showDatePicker = (isStart: boolean) => {
    setIsStartPicker(isStart);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    if (isStartPicker) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
  };

  const addDay = () => {
    let nextDate: Date;

    if (days.length === 0) {
      // If no days, use start date
      if (startDate) {
        nextDate = new Date(startDate);
      } else {
        console.error('Start date is not set.');
        return;
      }
    } else {
      // Calculate the next date based on the last day's date
      const lastDay = days[days.length - 1];
      if (lastDay.date) {
        nextDate = lastDay.date.toDate();
        nextDate.setDate(nextDate.getDate() + 1); // Increment by one day
      } else {
        console.error('Last day date is not set.');
        return;
      }
    }

    setDays(prevDays => [
      ...prevDays,
      {
        date: firestore.Timestamp.fromDate(nextDate),
        morning: null,
        afternoon: null,
      },
    ]);
  };

  const removeDay = (index: number) => {
    const updatedDays = days.filter((_, dayIndex) => dayIndex !== index);
    setDays(updatedDays);
  };

  const handleAttractionSelected = (
    dayIndex: number,
    attraction: Attraction,
    isMorning: boolean,
  ) => {
    const updatedDays = days.map((day, index) => {
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
    setDays(updatedDays);
  };

  const saveTrip = async () => {
    try {
      const newTrip: Trip = {
        id: firestore().collection('trips').doc().id,
        trip_name: tripName,
        user_id: profile?.email, // Replace with actual user id
        start_date: startDate ? firestore.Timestamp.fromDate(startDate) : null,
        end_date: endDate ? firestore.Timestamp.fromDate(endDate) : null,
        days: days,
      };

      await firestore().collection('trips').doc(newTrip.id).set(newTrip);
      dispatch(addTrip(newTrip));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving trip: ', error);
    }
  };

  const renderDay = ({item, index}: {item: Day; index: number}) => {
    const morningAttraction = item.morning ? item.morning.id : null;
    const afternoonAttraction = item.afternoon ? item.afternoon.id : null;

    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayDate}>
          Day {index + 1}:{' '}
          {item.date ? item.date.toDate().toDateString() : 'Unknown Date'}
        </Text>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            Morning: {morningAttraction || 'No Activity'}
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              setSelectedDayIndex(index);
              navigation.navigate('Cities', {
                onSelectAttraction: (attraction: Attraction) =>
                  handleAttractionSelected(index, attraction, true),
              });
            }}>
            <Text style={styles.buttonText}>Add Activity</Text>
          </Pressable>
        </View>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>
            Afternoon: {afternoonAttraction || 'No Activity'}
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              setSelectedDayIndex(index);
              navigation.navigate('Cities', {
                onSelectAttraction: (attraction: Attraction) =>
                  handleAttractionSelected(index, attraction, false),
              });
            }}>
            <Text style={styles.buttonText}>Add Activity</Text>
          </Pressable>
        </View>
        <Pressable style={styles.removeButton} onPress={() => removeDay(index)}>
          <Text style={styles.removeButtonText}>Remove Day</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <CustomHeader title="Add Trip" back={true} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Trip Name"
          value={tripName}
          onChangeText={setTripName}
        />
        <Pressable onPress={() => showDatePicker(true)}>
          <Text style={styles.dateText}>
            Start Date: {startDate ? startDate.toDateString() : 'Select Date'}
          </Text>
        </Pressable>
        <Pressable onPress={() => showDatePicker(false)}>
          <Text style={styles.dateText}>
            End Date: {endDate ? endDate.toDateString() : 'Select Date'}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={days}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderDay}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <CommonButton text="Add Day" onPress={addDay} />
          </View>
        }
      />
      <View style={styles.saveButtonContainer}>
        <CommonButton
          text="Save Trip"
          onPress={saveTrip}
          buttonStyle={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  inputContainer: {
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
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
  footerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  saveButtonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9f9f9',
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
});

export default AddTripScreen;
