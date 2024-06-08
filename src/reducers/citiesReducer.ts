import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import fetchCities from '../firebase/firebaseHelper';
import {CitiesState, City} from '../type/city';
import firebaseHelper from '../firebase/firebaseHelper';

// Initial state
const initialState: CitiesState = {
  locations: [],
};

// Async thunk to fetch cities from Firebase
export const fetchCitiesList = createAsyncThunk(
  'cities/fetchCitiesList',
  async (_, {rejectWithValue}) => {
    try {
      const response = await firebaseHelper.fetchCities();
      console.log('fetchCities response', response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
);

// Redux slice
const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.locations = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCitiesList.fulfilled, (state, action) => {
      console.log('Action payload:', action.payload);
      state.locations = action.payload || []; // Ensure locations is always an array
      console.log('Updated state.locations:', state.locations);
    });
  },
});

export default citiesSlice.reducer;
