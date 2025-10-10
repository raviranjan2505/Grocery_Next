// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie"; // ✅ to read cookies
import { API_BASE_URL } from "@/utils/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies (if your backend also uses cookie auth)
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Attach Bearer token from cookies automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken"); // 👈 same key you set after OTP verify
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }else {
    delete config.headers.Authorization; // ensure no stale token
  }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

