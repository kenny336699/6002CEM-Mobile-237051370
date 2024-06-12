import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {profile, userState} from '../type/user';
import {RootState} from '../store/store';

// Define the initial state interface
interface UserState {
  userProfile: profile | null;
}

// Define the initial state
const initialState: UserState = {
  userProfile: null,
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<profile>) => {
      console.log('action', action.payload);
      state.userProfile = action.payload;
    },
    clearUser: state => {
      state.userProfile = null;
    },
  },
});

// Export actions and reducer
export const {clearUser, setUserProfile} = userSlice.actions;
export default userSlice.reducer;
export const isLogin = (state: RootState) => state?.user?.uid != null;
