import axios from "axios";
import { BASE_URL } from "./constants";

// Normalize BASE_URL (remove trailing slash if present)
const API_BASE = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedRequestsQueue = [];

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh");

  if (!refreshToken) {
    return logoutUser();
  }

  try {
    const response = await axios.post(`${API_BASE}/api/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access: newAccessToken, refresh: newRefreshToken } = response.data;

    // Update both access and refresh tokens
    localStorage.setItem("access", newAccessToken);
    localStorage.setItem("refresh", newRefreshToken);

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed", error);
    return logoutUser();
  }
};

const logoutUser = () => {
  localStorage.clear();
  window.location.href = "/login";
  return Promise.reject("Session expired");
};

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for token expiration
    const isTokenExpired =
      error.response?.status === 401 ||
      error.response?.data?.code === "token_not_valid";

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject, originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Resolve queued requests
        failedRequestsQueue.forEach(({ resolve, originalRequest }) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axiosInstance(originalRequest));
        });

        failedRequestsQueue = [];
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Reject all queued requests
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
