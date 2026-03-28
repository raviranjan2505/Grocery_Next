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

type LoginStore = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  email: string;
  password: string;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setSuccessMessage: (msg: string | null) => void;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadTokenFromCookie: () => void;
};

export const useLoginStore = create<LoginStore>()(
  persist(
    (set) => ({
      user: null,
      token: Cookies.get("authToken") ?? null,
      isLoading: false,
      error: null,
      successMessage: null,
      email: "",
      password: "",

      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setSuccessMessage: (msg) => set({ successMessage: msg }),

      login: async (email, password) => {
        if (!email?.trim() || !password) {
          set({ error: "Email and password are required" });
          return false;
        }
        set({ isLoading: true, error: null, successMessage: null });
        try {
          const res = await axiosInstance.post(`${API_ROUTES.AUTH}/login`, {
            email: email.trim(),
            password,
          });

          const token = res.data?.accessToken ?? null;
          const refreshToken = res.data?.refreshToken ?? null;
          const userId = res.data?.userId ?? null;
          const role = res.data?.Role ?? null;

          if (!token) {
            set({ isLoading: false, error: "Login failed: No access token received" });
            return false;
          }

          Cookies.set("authToken", token, { path: "/", sameSite: "Lax" });
          if (refreshToken) {
            Cookies.set("refreshToken", refreshToken, {
              path: "/",
              sameSite: "Lax",
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
          }

          set({
            user: userId
              ? {
                  id: String(userId),
                  name: null,
                  email: email.trim(),
                  role,
                }
              : null,
            token,
            isLoading: false,
            successMessage: "Login successful!",
            email: "",
            password: "",
          });

          return true;
        } catch (err: any) {
          set({ isLoading: false, error: err.response?.data?.message || "Login failed" });
          return false;
        }
      },

      logout: () => {
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("authToken");
        localStorage.removeItem("address-storage")
        set({
          user: null,
          token: null,
          successMessage: null,
          error: null,
          email: "",
          password: "",
        });
      },

      loadTokenFromCookie: () => {
        const token = Cookies.get("authToken") ?? null;
        set({ token });
      },
    }),
    {
      name: "login-storage",
      version: 2,
      partialize: (state) => ({ user: state.user }),
      migrate: (persistedState: any) => ({ user: persistedState?.user ?? null }),
      onRehydrateStorage: () => (state) => {
        state?.loadTokenFromCookie?.();
      },
    }
  )
);
