import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // מנהל את הסטייט של המשתמשים
  },
});

export default store;
