import React from "react";
import Customer from "./Customer";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";

export async function generateMetadata() {
  const isArabic = LOCALE_LANGUAGE === "ar";

  return {
    title: isArabic
      ? "خدمة العملاء - معهد لندن كراون للتدريب"
      : "Customer Services - London Crown Institute of Training",
    description: isArabic
      ? "احصل على دعم احترافي لخدمة العملاء لجميع استفساراتك. نحن هنا لمساعدتك وتقديم أفضل تجربة ممكنة."
      : "Get professional customer service support for all your inquiries. We are here to assist you with your needs and provide the best experience.",
    openGraph: {
      title: isArabic
        ? "خدمة العملاء - معهد لندن كراون للتدريب"
        : "Customer Services - London Crown Institute of Training",
      description: isArabic
        ? "هل تحتاج إلى مساعدة؟ فريق خدمة العملاء لدينا هنا لتقديم الإرشادات، وحل المشكلات، وتحسين تجربتك."
        : "Need help? Our customer service team is here to provide guidance, resolve issues, and enhance your experience.",
      url: `${DOMAIN_URL}/customer-service`,
      type: "website",

      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
          width: 800,
          height: 600,
          alt: isArabic ? "دعم خدمة العملاء" : "Customer Service Support",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/customer-service`,
    },
  };
}

const Page = () => {
  return (
    <>
      <Customer />
    </>
  );
};

export default Page;
