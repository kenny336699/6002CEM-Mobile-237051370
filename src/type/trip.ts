// src/type/trip.ts

import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface Trip {
  id: string;
  trip_name: string;
  user_id: string | null;
  start_date: FirebaseFirestoreTypes.Timestamp | null;
  end_date: FirebaseFirestoreTypes.Timestamp | null;
  days: Day[];
}

export interface Day {
  date: FirebaseFirestoreTypes.Timestamp | null;
  morning: FirebaseFirestoreTypes.DocumentReference | null;
  afternoon: FirebaseFirestoreTypes.DocumentReference | null;
}

export interface TripState {
  trips: Trip[];
}
