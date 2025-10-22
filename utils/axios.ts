// utils/axiosInstance.ts
import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const getCsrfToken = (): string | null => {
  try {
    if (typeof document === "undefined") return null;
    const metaElement = document.querySelector(
      'meta[name="csrf-token"]'
    ) as HTMLMetaElement | null;
    return metaElement?.content || null;
  } catch (error) {
    // console.log("Failed to retrieve CSRF token:", error);
    return null;
  }
};

// 🔹 Global counter (for tracking API usage)
let requestCount = 0;
let lastRequestTime = Date.now();
const RESET_TIMEOUT = 60000; // 1 minute in milliseconds

const createAxiosInstance = (): AxiosInstance => {
  const csrfToken = getCsrfToken();

  const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": LOCALE_LANGUAGE,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...(csrfToken && { "X-CSRF-Token": csrfToken }),
    },
  });

  // ✅ Request interceptor (no delay)
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const currentTime = Date.now();

      // Reset counter if more than 1 minute has passed since last request
      if (currentTime - lastRequestTime > RESET_TIMEOUT) {
        requestCount = 0;
        if (typeof window !== "undefined") {
          localStorage.setItem("apiRequestCount", "0");
        }
        // console.log("Request counter reset after 1 minute of inactivity");
      }

      lastRequestTime = currentTime;
      requestCount++;
      console.log(
        `API Request #${requestCount}:`,
        config.method?.toUpperCase(),
        config.url
      );

      // Optional: persist count and last request time in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("apiRequestCount", requestCount.toString());
        localStorage.setItem("lastRequestTime", lastRequestTime.toString());
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // console.log("Axios request failed:", {
      //   url: error.config?.url,
      //   method: error.config?.method,
      //   status: error.response?.status,
      //   message: error.message,
      //   responseData: error.response?.data,
      // });
      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();
export default axiosInstance;

// // utils/axiosInstance.ts
// import { BACKEND_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
// import axios, { AxiosInstance, AxiosError } from "axios";

// // Utility function to get CSRF token safely
// const getCsrfToken = (): string | null => {
//   try {
//     if (typeof document === "undefined") return null;
//     const metaElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
//     return metaElement?.content || null;
//   } catch (error) {
// console.log("Failed to retrieve CSRF token:", error);
//     return null;
//   }
// };

// // Create axios instance with enhanced configuration
// const createAxiosInstance = (): AxiosInstance => {
//   const csrfToken = getCsrfToken();

//   const instance = axios.create({
//     baseURL: BACKEND_URL,
//     timeout: 10000, // Added timeout to prevent hanging requests
//     headers: {
//       "Content-Type": "application/json",
//       "Accept-Language": LOCALE_LANGUAGE,
//       "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//       Pragma: "no-cache",
//       Expires: "0",
//       ...(csrfToken && { "X-CSRF-Token": csrfToken }),
//     },
//   });

//   // Add response interceptor for error logging
//   instance.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
// console.log("Axios request failed:", {
//         url: error.config?.url,
//         method: error.config?.method,
//         status: error.response?.status,
//         message: error.message,
//         responseData: error.response?.data,
//       });
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// // Export singleton instance
// const axiosInstance = createAxiosInstance();
// export default axiosInstance;
