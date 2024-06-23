import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import {City, Attraction} from '../type/city';
import {Trip} from '../type/trip';
import getWeatherForecast from '../api/weather'; // Adjust the path if needed

const fetchCities = async (): Promise<City[]> => {
  try {
    const citiesCollection = await firestore().collection('cities').get();
    const citiesData = citiesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return citiesData as City[];
  } catch (error) {
    console.error('Error fetching cities: ', error);
    return [];
  }
};

const fetchCityWithAttractions = async (cityId: string) => {
  try {
    const cityDoc = await firestore().collection('cities').doc(cityId).get();
    if (!cityDoc.exists) {
      throw new Error('City not found');
    }
    const cityData = cityDoc.data() as City;
    const attractionRefs = cityData.attractions || [];
    const attractionDocs = await Promise.all(
      attractionRefs.map(ref => ref.get()),
    );
    const attractionData = attractionDocs.map(
      doc => ({id: doc.id, ...doc.data()} as Attraction),
    );

    const weather = await getWeatherForecast(
      cityData.coordinates.latitude,
      cityData.coordinates.longitude,
    );
    weather.shift(); // Remove the current day's weather

    return {
      cityData,
      attractionData,
      weather,
    };
  } catch (error) {
    console.error('Error fetching city with attractions: ', error);
    throw error;
  }
};

const addLandmarks = async () => {
  const landmarksCollection = firestore().collection('attractions');

  for (const landmark of landmarks) {
    try {
      await landmarksCollection
        .doc(landmark.documentId.toString())
        .set(landmark);
      console.log(`Document ${landmark.documentId} added successfully`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
};

const firebaseLogin = async (email: string, password: string) => {
  try {
    const data = await auth().signInWithEmailAndPassword(email, password);
    console.log('User signed in!', data);
    return {success: true};
  } catch (error) {
    let errorMessage = 'An error occurred during login.';

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      default:
        errorMessage = error.message;
        break;
    }

    return {success: false, errorMessage};
  }
};

const firebaseRegister = async (
  email: string,
  password: string,
  displayName: string,
) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    await user.updateProfile({displayName});
    await auth().signOut();
    return {success: true};
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.log('That email address is already in use!');
        break;
      case 'auth/invalid-email':
        console.log('That email address is invalid!');
        break;
      case 'auth/weak-password':
        console.log('The password is too weak.');
        break;
      default:
        console.error('Error creating user:', error);
        break;
    }
    return {success: false};
  }
};

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
    return attractionsMap;
  } catch (error) {
    console.error('Error fetching attraction details:', error);
    return new Map<string, Attraction>();
  }
};

const firebaseLogout = async () => {
  await auth().signOut();
  console.log('User signed out!');
};

const formatDate = (date: FirebaseFirestoreTypes.Timestamp | null): string => {
  if (!date) return 'Invalid Date';
  try {
    return format(date.toDate(), 'dd MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const fetchTrips = async (email: string): Promise<Trip[]> => {
  try {
    const snapshot = await firestore()
      .collection('trips')
      .where('user_id', '==', email)
      .get();
    const trips: Trip[] = snapshot.docs.map(
      doc => ({id: doc.id, ...doc.data()} as Trip),
    );
    return trips;
  } catch (error) {
    throw new Error('Error fetching trips');
  }
};

export default {
  fetchCityWithAttractions,
  fetchCities,
  firebaseLogin,
  firebaseRegister,
  firebaseLogout,
  formatDate,
  fetchAttractionDetails,
  fetchTrips,
  addLandmarks,
};
