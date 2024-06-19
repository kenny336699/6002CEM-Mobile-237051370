import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type Day = {
  date: FirebaseFirestoreTypes.Timestamp | null;
  morning: FirebaseFirestoreTypes.DocumentReference | null;
  afternoon: FirebaseFirestoreTypes.DocumentReference | null;
};

export type Attraction = {
  id: string;
  name: string;
  description: string;
  location: string;
  // ... other fields
};

export type Trip = {
  id: string;
  trip_name: string;
  user_id: string;
  start_date: FirebaseFirestoreTypes.Timestamp | null;
  end_date: FirebaseFirestoreTypes.Timestamp | null;
  days: Day[];
};

export type TripState = {
  trips: Trip[];
};
