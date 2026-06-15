import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cinetrack_auth";

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { user: null };
  } catch {
    return { user: null };
  }
};

const persistAuth = (state) => {
  if (state.user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }));
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
      persistAuth(state);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;
