import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cinetrack_auth";

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const persistAuth = (state) => {
  if (state.token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const initialState = loadStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      persistAuth(state);
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        persistAuth(state);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      persistAuth(state);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;
