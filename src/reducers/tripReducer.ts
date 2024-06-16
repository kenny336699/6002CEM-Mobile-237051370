// src/redux/slices/tripSlice.ts

import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import firebaseHelper from '../firebase/firebaseHelper';
import {Trip, TripState} from '../type/trip';

// Thunk for fetching trips
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (email: string, {rejectWithValue}) => {
    try {
      const trips = await firebaseHelper.fetchTrips(email);
      return trips;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState: TripState = {
  trips: [],
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
    updateTrip: (state, action: PayloadAction<Trip>) => {
      const index = state.trips.findIndex(
        trip => trip.id === action.payload.id,
      );
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
    },
    clearTrips: state => {
      state.trips = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(
      fetchTrips.fulfilled,
      (state, action: PayloadAction<Trip[]>) => {
        state.trips = action.payload;
      },
    );
  },
});

export const {addTrip, updateTrip, deleteTrip, clearTrips} = tripSlice.actions;

export default tripSlice.reducer;
