import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
  selectToken,
  setCredentials,
  updateUser,
} from "../features/auth/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login: (payload) => dispatch(setCredentials(payload)),
    logout: () => dispatch(logoutAction()),
    updateUser: (payload) => dispatch(updateUser(payload)),
  };
}
