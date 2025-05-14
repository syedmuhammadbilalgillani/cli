// PageWrapper.tsx (Server Component)
import Loading from "@/components/Loading";
import Register from "./Register";
import { Suspense } from "react";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title:
    LOCALE_LANGUAGE === "en"
      ? "Register Course - London Crown Institute of Training"
      : "تسجيل دورة - معهد لندن كراون للتدريب",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
}
