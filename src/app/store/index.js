import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../services/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
