import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

client.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("cinetrack_auth");
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* ignore */
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid/expired to prevent getting stuck
      if (localStorage.getItem("cinetrack_auth")) {
        localStorage.removeItem("cinetrack_auth");
        window.location.reload(); // Force app to re-evaluate auth state
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
