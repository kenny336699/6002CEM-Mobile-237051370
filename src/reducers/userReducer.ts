import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { userProfile } from "../../types/user";

// Define the initial state interface
interface UserState {
  uid: number | null;
  auth: string | null;
  userProfile: userProfile | null;
}

// Define the initial state
const initialState: UserState = {
  uid: null,
  auth: null,
  userProfile: null,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUid: (state, action: PayloadAction<number>) => {
      state.uid = action.payload;
    },
    setAuth: (state, action: PayloadAction<string>) => {
      state.auth = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<userProfile>) => {
      state.userProfile = action.payload;
    },
    clearUser: (state) => {
      state.uid = null;
      state.auth = null;
      state.userProfile = null;
    },
  },
});

// Export actions and reducer
export const { setUid, clearUser, setAuth, setUserProfile } = userSlice.actions;
export default userSlice.reducer;
export const isLogin = (state: RootState) => state?.user?.uid != null;
export const getToken = (state: RootState) => state?.user?.auth ?? "";
