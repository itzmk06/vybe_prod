import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        // Network error / CORS issue
        if (!error.response) {
            console.error("Network/CORS error:", error.message);
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        // Safety check
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Don't refresh refreshToken requests
        const isRefreshRequest =
            originalRequest.url === "/refreshToken";

        if (
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest
        ) {
            originalRequest._retry = true;

            try {

                console.log("Refreshing access token...");

                await api.post(
                    "/refreshToken",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                console.log("Refresh successful");

                // Retry original request
                return api(originalRequest);

            } catch (refreshError) {

                console.error("Session expired");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;