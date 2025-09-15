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

type SignupStore = {
    user: User | null
    token: string | null
    isLoading: boolean
    error: string | null
    successMessage: string | null
    step: Step
    mobile: string
    otp: string[]

    setStep: (step: Step) => void
    setMobile: (mobile: string) => void
    setOtp: (otp: string[]) => void
    setSuccessMessage: (msg: string | null) => void
    setError: (msg: string | null) => void

    sendOtp: (mobile: string) => Promise<boolean>
    verifyOtp: (mobile: string, otp: string) => Promise<boolean>
    logout: () => Promise<void>
}

export const useSignupStore = create<SignupStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            successMessage: null,
            step: "mobile",
            mobile: "",
            otp: Array(6).fill(""),

            setStep: (step) => set({ step }),
            setMobile: (mobile) => set({ mobile }),
            setOtp: (otp) => set({ otp }),
            setSuccessMessage: (msg) => set({ successMessage: msg }),
            setError: (msg) => set({ error: msg }),

            // 🔹 Send OTP
            sendOtp: async (mobile: string) => {
                set({ isLoading: true, error: null, successMessage: null })
                try {
                    const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signup/send-otp`, {
                        MobileNumber: mobile,
                    })
                    console.log(response)
                    if (response.data.success) {
                        set({ isLoading: false, step: "otp", mobile })
                        return true
                    } else {
                        set({ isLoading: false, error: response.data.message || "Failed to send OTP" })
                        return false
                    }

                } catch (err: any) {
                    set({
                        isLoading: false,
                        error: err?.response?.data?.message || err.message || "Failed to send OTP",
                    })
                    return false
                }
            },

            // 🔹 Verify OTP
            verifyOtp: async (mobile: string, otp: string) => {
                set({ isLoading: true, error: null, successMessage: null })
                try {
                    const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signup/verify-otp`, {
                        MobileNumber: mobile,
                        Otp: otp,
                    })

                    if (response.data.success) {
                        const token = response.data?.data?.token ?? null
                        const user = response.data?.data?.userData ?? null

                        set({
                            isLoading: false,
                            user,
                            token,
                            step: "mobile",
                            mobile: "",
                            otp: Array(6).fill(""),
                            successMessage: "OTP Verified ✅ Signup Successful 🎉",
                            error: null,
                        })
                        return true
                    } else {
                        set({
                            isLoading: false,
                            error: response.data.message || "OTP verification failed",
                            successMessage: null,
                        })
                        return false
                    }
                } catch (err: any) {
                    set({
                        isLoading: false,
                        error: err?.response?.data?.message || err.message || "OTP verification failed",
                        successMessage: null,
                    })
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
                    successMessage: null,
                    error: null,
                })
            },
        }),
        {
            name: "signup-storage",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
            }),
        }
    )
)
