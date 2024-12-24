import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // שמירת הטוקן ב-localStorage
      const tokenData = {
        token: action.payload.token,
        expiresAt: Date.now() + 100 * 60 * 1000, // טוקן תקף ל-10 דקות
      };
      localStorage.setItem("token", JSON.stringify(tokenData));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // מחיקת הטוקן
    },
    restoreSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, restoreSession } = userSlice.actions;

export default userSlice.reducer;
