import { create } from "zustand"
import { persist } from "zustand/middleware"
import axiosInstance from "@/lib/axios"
import { API_ROUTES } from "@/utils/api"

type User = {
  id: string
  name: string | null
  email: string | null
  role: "USER" | "SUPER_ADMIN" | null
}

type Step = "mobile" | "otp"

type LoginStore = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  step: Step
  mobile: string
  otp: string[]

 successMessage: string | null
setSuccessMessage: (msg: string | null) => void

  setStep: (step: Step) => void
  setMobile: (mobile: string) => void
  setOtp: (otp: string[]) => void

  sendOtp: (mobile: string) => Promise<boolean>
  verifyOtp: (mobile: string, otp: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      step: "mobile",
      mobile: "",
       successMessage: null,
  setSuccessMessage: (msg) => set({ successMessage: msg }),
      otp: Array(6).fill(""),

      setStep: (step) => set({ step }),
      setMobile: (mobile) => set({ mobile }),
      setOtp: (otp) => set({ otp }),

      // 🔹 Send OTP
      sendOtp: async (mobile: string) => {
        set({ isLoading: true, error: null })
        try {
         const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signin/send-otp`, {
            MobileNumber: mobile,
          })
          set({ isLoading: false, step: "otp", mobile })
          console.log(response)
          return true
        } catch {
          set({ isLoading: false, error: "Failed to send OTP" })
          return false
        }
      },

      // 🔹 Verify OTP
      verifyOtp: async (mobile: string, otp: string) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signin/verify-otp`, { MobileNumber: mobile, Otp: otp })

      const token = response.data?.data?.token ?? null
      if (token) localStorage.setItem("auth-token", token)

      set({
        isLoading: false,
        user: response.data?.data?.userData ?? null,
        token,
        step: "mobile",
        mobile: "",
        otp: Array(6).fill(""),
        successMessage: "OTP Verified ✅ Login Successful 🎉"
      })
      return true
    } catch {
      set({ isLoading: false, error: "OTP verification failed", successMessage: null })
      return false
    }
  },

      // 🔹 Logout
      logout: async () => {
        set({
          user: null,
          token: null,
          isLoading: false,
          step: "mobile",
          mobile: "",
          otp: Array(6).fill(""),
        })
      },
    }),
    {
      name: "login-storage", // key in localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }), // only persist token & user
    }
  )
)
