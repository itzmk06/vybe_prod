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
        await api.post("/refreshToken", {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired!");
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("Network/CORS error:", error.message);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;