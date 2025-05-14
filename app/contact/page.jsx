// Page.tsx (Server Component)
import { LOCALE_LANGUAGE, DOMAIN_URL } from "@/constant/apiUrl";
import ContactPage from "./ContactUs";

export const generateMetadata = () => {
  const metadataEn = {
    title: "Contact Us - London Crown Institute of Training",
    description:
      "Get in touch with us for inquiries about our Training Courses. We're here to help!",
    openGraph: {
      title: "Contact Us - London Crown Institute of Training",
      description:
        "Get in touch with us for inquiries about our Training Courses. We're here to help!",
      url: "https://clinstitute.co.uk/contact",
      type: "website",
      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "Contact Us - London Crown Institute of Training",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us - London Crown Institute of Training",
      description:
        "Get in touch with us for inquiries about our Training Courses. We're here to help!",
      images: ["https://clinstitute.co.uk/Logocrown.webp"],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/contact`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  const metadataAr = {
    title: "اتصل بنا - معهد لندن كراون للتدريب",
    description:
      "تواصل معنا للاستفسارات حول دوراتنا التدريبية. نحن هنا لمساعدتك!",
    openGraph: {
      title: "اتصل بنا - معهد لندن كراون للتدريب",
      description:
        "تواصل معنا للاستفسارات حول دوراتنا التدريبية. نحن هنا لمساعدتك!",
      url: "https://ar.clinstitute.co.uk/contact",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "اتصل بنا - معهد لندن كراون للتدريب",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "اتصل بنا - معهد لندن كراون للتدريب",
      description:
        "تواصل معنا للاستفسارات حول دوراتنا التدريبية. نحن هنا لمساعدتك!",
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
      <ContactPage />
    </div>
  );
}
