// src/lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function getOrCreateCookieId() {
  let cookieId = Cookies.get("cookieId");

  // Use negative numeric ids so they never collide with real user ids (positive ints).
  if (!cookieId || !/^-?\d+$/.test(cookieId)) {
    cookieId = String(-(1000000000 + Math.floor(Math.random() * 1000000000)));
    Cookies.set("cookieId", cookieId, { expires: 365, sameSite: "Lax", path: "/" });
  }

  return cookieId;
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type RefreshSuccess = { accessToken: string; refreshToken?: string };
type RefreshFailure = { invalidRefresh: true };
type RefreshOutcome = RefreshSuccess | RefreshFailure | null;

let refreshInFlight: Promise<RefreshOutcome> | null = null;

function refreshTokenExpiryDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

async function refreshAccessToken(): Promise<RefreshOutcome> {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) return null;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const cookieId = getOrCreateCookieId();
        const res = await refreshClient.post(
          "/v1/auth/refresh-token",
          { refreshToken },
          { headers: { "x-cookie-id": cookieId } }
        );

        const accessToken = res.data?.accessToken ?? null;
        const newRefreshToken = res.data?.refreshToken ?? null;
        if (!accessToken) return null;

        Cookies.set("authToken", accessToken, { path: "/", sameSite: "Lax" });
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, {
            path: "/",
            sameSite: "Lax",
            expires: refreshTokenExpiryDate(),
          });
        }

        return { accessToken, refreshToken: newRefreshToken ?? undefined };
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 400 || status === 401) return { invalidRefresh: true };
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");

    // Always attach cookie id so guests can use cart and we can correlate sessions.
    const cookieId = getOrCreateCookieId();
    config.headers = config.headers || {};
    config.headers["x-cookie-id"] = cookieId;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const config = error.config;

    if ((status === 401 || status === 403) && config && !config.__isRetryRequest) {
      const isRefreshCall = typeof config?.url === "string" && config.url.includes("/v1/auth/refresh-token");
      const refreshToken = Cookies.get("refreshToken");

      const msg = typeof message === "string" ? message.toLowerCase() : "";
      const looksLikeTokenProblem =
        status === 401 || msg.includes("token") || msg.includes("jwt") || msg.includes("expired") || msg.includes("unauth");

      const shouldTryRefresh =
        !!refreshToken &&
        !isRefreshCall &&
        (status === 401 || (status === 403 && looksLikeTokenProblem));

      if (shouldTryRefresh) {
        const refreshed = await refreshAccessToken();
        if (refreshed && "invalidRefresh" in refreshed) {
          Cookies.remove("authToken");
          Cookies.remove("refreshToken");
        } else if (refreshed?.accessToken) {
          const retryConfig = { ...config, __isRetryRequest: true };
          retryConfig.headers = retryConfig.headers || {};
          retryConfig.headers.Authorization = `Bearer ${refreshed.accessToken}`;
          return axiosInstance.request(retryConfig);
        }

        // If refresh failed (network/server) keep cookies intact to avoid forced logout.
      } else if (status === 401 && !refreshToken) {
        // No refresh token available -> session truly unauthenticated.
        Cookies.remove("authToken");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
