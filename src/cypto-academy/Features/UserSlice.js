import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      state = action.payload;
    }
  }
});

export const { updateUserData } = UserSlice.actions;

export default UserSlice.reducer;
