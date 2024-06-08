import {createSlice} from '@reduxjs/toolkit';
import {AppState} from '../type/app';
import {RootState} from '../store/store';

const initialState: AppState = {
  loading: false,
};
const appsSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const {setLoading} = appsSlice.actions;

export default appsSlice.reducer;
