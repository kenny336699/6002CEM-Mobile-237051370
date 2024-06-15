import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type Trip = {
  id: string;
  trip_name: string;
  user_id: string;
  start_date: FirebaseFirestoreTypes.Timestamp | null;
  end_date: FirebaseFirestoreTypes.Timestamp | null;
  days: Array<{
    date: FirebaseFirestoreTypes.Timestamp | null;
    morning: FirebaseFirestoreTypes.DocumentReference | null;
    afternoon: FirebaseFirestoreTypes.DocumentReference | null;
  }>;
};
