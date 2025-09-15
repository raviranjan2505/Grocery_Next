import axios from "axios"
import { API_BASE_URL } from "@/utils/api"

// Create a global axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

// Attach token from localStorage (Zustand persistence) before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
