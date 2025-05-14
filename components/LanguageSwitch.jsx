import { AR_DOMAIN_URL, EN_DOMAIN_URL } from "@/constant/apiUrl";
import axiosInstance from "@/utils/axios";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const useSwitchLanguage = () => {
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitchLanguage = async (toArabic) => {
    const isRootPath = path === "/" || path.trim() === "";

    const targetDomain = toArabic
      ? AR_DOMAIN_URL
      : EN_DOMAIN_URL;

    if (isRootPath) {
      const finalUrl = `${targetDomain}/`;
      console.log("[SwitchLang] Root path detected. Redirecting to:", finalUrl);
      window.open(finalUrl, "_blank");
      return;
    }

    try {
      setIsLoading(true);
      const pathSegments = path.split("/").filter(Boolean);
      console.log("[SwitchLang] Original segments:", pathSegments);

      const requestBody = {
        segments: pathSegments.map((segment) => decodeURIComponent(segment)),
      };

      console.log("[SwitchLang] Request body to API:", requestBody);

      const response = await axiosInstance.post(
        "/translate-segments",
        requestBody
      );
      console.log("[SwitchLang] API response:", response);

      const translatedSegments = Object.values(response.data);
      console.log("[SwitchLang] Translated segments:", translatedSegments);

      const translatedPath = translatedSegments.join("/");
      console.log("[SwitchLang] Translated path:", translatedPath);

      const finalUrl = `${targetDomain}/${translatedPath}`;
      console.log("[SwitchLang] Final URL:", finalUrl);

      window.location.href = finalUrl;
    } catch (error) {
      console.error("[SwitchLang] Error during language switch:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("[SwitchLang] Network error or CORS issue detected");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSwitchLanguage, isLoading };
};
