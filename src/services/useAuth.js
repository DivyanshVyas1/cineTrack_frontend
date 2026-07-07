import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
  setCredentials,
  updateUser,
} from "./authSlice";
import client from "./client";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  return {
    user,
    isAuthenticated,
    isAdmin,
    login: (payload) => dispatch(setCredentials(payload)),
    logout: async () => {
      try {
        await client.post("/auth/logout");
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        dispatch(logoutAction());
        window.location.reload(); // Hard reload to clear all states
      }
    },
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
}
