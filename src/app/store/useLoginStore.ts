"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { API_ROUTES } from "@/utils/api";
import Cookies from "js-cookie";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "SUPER_ADMIN" | null;
};

type Step = "mobile" | "otp";

type LoginStore = {
  user: User | null;
  token: string | null;
  step: Step;
  isLoading: boolean;
  error: string | null;
  mobile: string;
  otp: string[];
  successMessage: string | null;

  setMobile: (mobile: string) => void;
  setOtp: (otp: string[]) => void;
  setStep: (step: Step) => void;
  setSuccessMessage: (msg: string | null) => void;

  sendOtp: (mobile: string) => Promise<boolean>;
  verifyOtp: (mobile: string, otp: string[]) => Promise<boolean>;
  logout: () => void;
  loadTokenFromCookie: () => void;
};

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      step: "mobile",
      isLoading: false,
      error: null,
      mobile: "",
      otp: Array(6).fill(""),
      successMessage: null,

      setMobile: (mobile) => set({ mobile }),
      setOtp: (otp) => set({ otp }),
      setStep: (step) => set({ step }),
      setSuccessMessage: (msg) => set({ successMessage: msg }),

      sendOtp: async (mobile) => {
        if (!mobile || mobile.length !== 10) {
          set({ error: "Invalid mobile number" });
          return false;
        }

        set({ isLoading: true, error: null });
        try {
          const res = await axiosInstance.post(`${API_ROUTES.AUTH}/signin/send-otp`, { MobileNumber: mobile });
          set({ step: "otp", isLoading: false });
          console.log(res)
          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err?.response?.data?.message || "Failed to send OTP" });
          return false;
        }
      },

      verifyOtp: async (mobile, otp) => {
        if (!mobile || otp.length !== 6) {
          set({ error: "Invalid mobile number or OTP" });
          return false;
        }

        set({ isLoading: true, error: null, successMessage: null });

        try {
          const res = await axiosInstance.post(`${API_ROUTES.AUTH}/signin/verify-otp`, {
            MobileNumber: mobile,
            Otp: otp.join(""),
          });

          const user = res.data?.data?.userData ?? null;
          const token = res.data?.data?.token ?? null;

          if (!token) {
            set({ isLoading: false, error: "OTP verification failed: No token received" });
            return false;
          }

          Cookies.set("authToken", token, { path: "/", sameSite: "strict" });

          set({
            user,
            token,
            step: "mobile",
            mobile: "",
            otp: Array(6).fill(""),
            isLoading: false,
            successMessage: "OTP Verified. Login Successful!",
          });

          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "OTP verification failed" });
          return false;
        }
      },

      logout: () => {
        Cookies.remove("authToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("address-storage")
        set({
          user: null,
          token: null,
          step: "mobile",
          mobile: "",
          otp: Array(6).fill(""),
          successMessage: null,
          error: null,
        });
      },

      loadTokenFromCookie: () => {
        const token = Cookies.get("authToken") ?? null;
        set({ token });
      },
    }),
    {
      name: "login-storage",
      partialize: (state) => ({
        user: state.user,
        mobile: state.mobile,
        otp: state.otp,
        step: state.step,
      }),
    }
  )
);
