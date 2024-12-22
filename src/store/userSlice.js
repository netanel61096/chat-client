import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // המשתמש המחובר
  isAuthenticated: false, // האם המשתמש מחובר
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // שומר את פרטי המשתמש
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
