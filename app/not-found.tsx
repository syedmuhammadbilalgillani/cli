"use client";

import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

// translations.ts
export const translations = {
  en: {
    title: "Oops! Page not found",
    description: "The page you're looking for doesn't exist or has been moved.",
    backToHome: "Back to Home",
    goBack: "Go Back",
  },
  ar: {
    title: "عذرًا! الصفحة غير موجودة",
    description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    backToHome: "العودة إلى الصفحة الرئيسية",
    goBack: "الرجوع",
  },
};

const NotFound = () => {
  const router = useRouter();
  const lang = LOCALE_LANGUAGE === "ar" ? "ar" : "en";
  const t = translations[lang]; // ✅ Assign the translation object

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="fixed top-0 left-0 z-[99] flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#12283E] p-4 text-center text-white"
    >
      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-gray-300">{t.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2 text-[#12283E] hover:bg-gray-100 transition"
          >
            <Home className="h-5 w-5" />
            {t.backToHome}
          </Link>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center cursor-pointer justify-center gap-2 rounded-md border border-white px-5 py-2 text-white hover:bg-secondary hover:text-white hover:border-secondary transition"
          >
            <ArrowLeft className="h-5 w-5" />
            {t.goBack}
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
