import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired!");
        // ❌ REMOVE: window.location.href = "/";
        // ✅ Just reject — let the component (ProtectedRoute) handle redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async () => {
  try {
    await api.post("/refreshToken", {}, { withCredentials: true });
  } catch (error) {
    throw new Error("Refresh token expired! Redirecting to login...");
  }
};

export default api;
