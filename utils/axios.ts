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
    const metaElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    return metaElement?.content || null;
  } catch (error) {
    console.log("Failed to retrieve CSRF token:", error);
    return null;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_DELAY_MS = 1000; // 1 second

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

  // ✅ Correctly typed request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const now = Date.now();
      const waitTime = MIN_DELAY_MS - (now - lastRequestTime);

      if (waitTime > 0) {
        await delay(waitTime);
      }

      lastRequestTime = Date.now();
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.log("Axios request failed:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
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
//     console.log("Failed to retrieve CSRF token:", error);
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
//       console.log("Axios request failed:", {
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
