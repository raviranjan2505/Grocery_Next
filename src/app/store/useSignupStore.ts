"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/utils/api";
import Cookies from "js-cookie"; // ✅ FIXED

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "SUPER_ADMIN" | null;
};

type Step = "mobile" | "otp";

type SignupStore = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  step: Step;
  mobile: string;
  otp: string[];

  setStep: (step: Step) => void;
  setMobile: (mobile: string) => void;
  setOtp: (otp: string[]) => void;
  setSuccessMessage: (msg: string | null) => void;
  setError: (msg: string | null) => void;

  sendOtp: (mobile: string) => Promise<boolean>;
  verifyOtp: (mobile: string, otp: string[]) => Promise<boolean>;
  logout: () => void;
};

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
        if (!mobile || mobile.length !== 10) {
          set({ error: "Enter a valid 10-digit mobile number" });
          return false;
        }

        set({ isLoading: true, error: null, successMessage: null });
        try {
          const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signup/send-otp`, {
            MobileNumber: mobile,
          });
         
          if (response.data?.success) {
            set({ step: "otp", mobile, isLoading: false });
             console.log(response,"otp for singup")
            return true;
          } else {
            set({
              isLoading: false,
              error: response.data?.message || "Failed to send OTP",
            });
            return false;
          }
        } catch (err: any) {
          set({
            isLoading: false,
            error: err?.response?.data?.message || err.message || "Failed to send OTP",
          });
          return false;
        }
      },

      // 🔹 Verify OTP
      verifyOtp: async (mobile: string, otp: string[]) => {
        if (!otp || otp.length !== 6) {
          set({ error: "Enter a valid 6-digit OTP" });
          return false;
        }

        set({ isLoading: true, error: null, successMessage: null });

        try {
          const response = await axiosInstance.post(`${API_ROUTES.AUTH}/signup/verify-otp`, {
            MobileNumber: mobile,
            Otp: otp.join(""), // ✅ Join array into string
          });

          if (response.data?.success) {
            const token = response.data?.data?.token ?? null;
            const user = response.data?.data?.userData ?? null;

            // Save token in cookie
            if (token) {
              Cookies.set("authToken", token, { path: "/", sameSite: "strict" });
            }

            set({
              user,
              token,
              step: "mobile",
              mobile: "",
              otp: Array(6).fill(""), // ✅ reset as array
              isLoading: false,
              successMessage: "OTP Verified ✅ Sign Up Successful 🎉",
              error: null,
            });

            return true;
          } else {
            set({
              isLoading: false,
              error: response.data?.message || "OTP verification failed",
              successMessage: null,
            });
            return false;
          }
        } catch (err: any) {
          console.error("OTP verification failed:", err.response?.data ?? err.message);
          set({
            isLoading: false,
            error: err.response?.data?.message || err.message || "OTP verification failed",
            successMessage: null,
          });
          return false;
        }
      },

      // 🔹 Logout
      logout: () => {
        Cookies.remove("authToken");
        set({
          user: null,
          token: null,
          isLoading: false,
          step: "mobile",
          mobile: "",
          otp: Array(6).fill(""),
          successMessage: null,
          error: null,
        });
      },
    }),
    {
      name: "signup-storage",
      partialize: (state) => ({ user: state.user, token: state.token }), // persist only user and token
    }
  )
);
