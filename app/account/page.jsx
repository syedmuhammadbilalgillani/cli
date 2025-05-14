import React from 'react';
import Account from './Account';
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";

// Define metadata for the account profile page
export async function generateMetadata() {
  const isArabic = LOCALE_LANGUAGE === 'ar';

  return {
    title: isArabic
      ? "الملف الشخصي - معهد لندن كراون للتدريب"
      : "Account Profile - London Crown Institute of Training",
    description: isArabic
      ? "قم بإدارة حسابك في معهد لندن كراون للتدريب. يمكنك الوصول إلى ملفك الشخصي، وتحديث بياناتك، ومتابعة تقدمك التعليمي."
      : "Manage your account with London Crown Institute of Training. Access your profile, update personal details, and track your learning progress.",
    keywords: isArabic
      ? "الملف الشخصي، لوحة المستخدم، معهد لندن كراون، حساب التدريب، الإعدادات الشخصية"
      : "account profile, user dashboard, London Crown Institute, training account, personal settings",
    openGraph: {
      title: isArabic
        ? "الملف الشخصي - معهد لندن كراون للتدريب"
        : "Account Profile - London Crown Institute of Training",
      description: isArabic
        ? "قم بإدارة حسابك ومتابعة تقدمك في معهد لندن كراون للتدريب."
        : "Manage your account and track your progress with London Crown Institute of Training.",
      url: `${DOMAIN_URL}/account`,
      type: "website",
      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "الملف الشخصي - معهد لندن كراون"
            : "Account Profile - London Crown Institute",
        },
      ],
    },
  };
}

const Page = () => {
  return (
    <div>
      <Account />
    </div>
  );
};

export default Page;