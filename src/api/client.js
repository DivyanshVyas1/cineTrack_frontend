import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // This ensures cookies are sent with every request
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login or clear auth state
      if (localStorage.getItem("cinetrack_auth")) {
        localStorage.removeItem("cinetrack_auth");
        window.location.reload(); 
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ERR_NETWORK") {
    return "Cannot reach server. Make sure the backend is running on port 5000.";
  }
  return fallback;
};

export default client;
