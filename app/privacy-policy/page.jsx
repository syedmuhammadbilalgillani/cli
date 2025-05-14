// Page.tsx (Server Component)
import { LOCALE_LANGUAGE, DOMAIN_URL } from "@/constant/apiUrl";
import PrivacyPolicy from "./Policy";

export const generateMetadata = () => {
  const metadataEn = {
    title: "Privacy Policy - London Crown Institute of Training",
    description:
      "Read our Privacy Policy to understand how we handle your data for Training Courses.",
    openGraph: {
      title: "Privacy Policy - London Crown Institute of Training",
      description:
        "Read our Privacy Policy to understand how we handle your data for Training Courses.",
      url: "https://clinstitute.co.uk/privacy-policy",
      type: "website",
      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "Privacy Policy - Training Courses",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/privacy-policy`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - London Crown Institute of Training",
      description:
        "Read our Privacy Policy to understand how we handle your data for Training Courses.",
      images: ["https://clinstitute.co.uk/Logocrown.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  const metadataAr = {
    title: "سياسة الخصوصية - معهد لندن كراون للتدريب",
    description:
      "اطلع على سياسة الخصوصية لدينا لفهم كيفية تعاملنا مع بياناتك لدورات التدريب.",
    openGraph: {
      title: "سياسة الخصوصية - معهد لندن كراون للتدريب",
      description:
        "اطلع على سياسة الخصوصية لدينا لفهم كيفية تعاملنا مع بياناتك لدورات التدريب.",
      url: "https://ar.clinstitute.co.uk/privacy-policy",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "سياسة الخصوصية - دورات التدريب",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/privacy-policy`,
    },
    twitter: {
      card: "summary_large_image",
      title: "سياسة الخصوصية - معهد لندن كراون للتدريب",
      description:
        "اطلع على سياسة الخصوصية لدينا لفهم كيفية تعاملنا مع بياناتك لدورات التدريب.",
      images: ["https://ar.clinstitute.co.uk/Logocrown.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return LOCALE_LANGUAGE === "ar" ? metadataAr : metadataEn;
};

export default function Page() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
