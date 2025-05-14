import AuthFormSignup from "@/components/AuthFormSignup";
import { LOCALE_LANGUAGE, DOMAIN_URL } from "@/constant/apiUrl";
import Image from "next/image";

export function generateMetadata() {
  const metadataEn = {
    title: "Sign Up - London Crown Institute of Training",
    description:
      "Create your account at London Crown Institute of Training. Sign Up to manage your courses, track progress, and stay updated with our latest training programs.",
    openGraph: {
      title: "Sign Up - London Crown Institute of Training",
      description:
        "Create your account at London Crown Institute of Training. Sign Up to manage your courses, track progress, and stay updated with our latest training programs.",
      url: "https://clinstitute.co.uk/sign-up",
      type: "website",
      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "Sign Up - London Crown Institute of Training",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/sign-up`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Sign Up - London Crown Institute of Training",
      description:
        "Create your account at London Crown Institute of Training. Sign Up to manage your courses, track progress, and stay updated with our latest training programs.",
      images: ["https://clinstitute.co.uk/Logocrown.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  const metadataAr = {
    title: "إنشاء حساب - معهد لندن كراون للتدريب",
    description:
      "أنشئ حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
    openGraph: {
      title: "إنشاء حساب - معهد لندن كراون للتدريب",
      description:
        "أنشئ حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
      url: "https://ar.clinstitute.co.uk/sign-up",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "إنشاء حساب - معهد لندن كراون للتدريب",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/sign-up`,
    },
    twitter: {
      card: "summary_large_image",
      title: "إنشاء حساب - معهد لندن كراون للتدريب",
      description:
        "أنشئ حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
      images: ["https://ar.clinstitute.co.uk/Logocrown.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return LOCALE_LANGUAGE === "ar" ? metadataAr : metadataEn;
}

const Page = () => {
  return (
    <>
      {/* <Design secondary={true} bg={true}></Design> */}
      <section className="flex justify-center md:mt-10 size-full rounded-3xl max-sm:px-6">
        <Image
          src="/sign.webp"
          alt="signin"
          className="hidden h-[400px] w-[400px] object-cover m-20 rounded-3xl md:block"
          layout="responsive" // Use intrinsic layout to manage dimensions through the CSS
          height={1000} // These values are optional but can help with preloading
          width={1000}
        />

        <div className="flex flex-col items-center justify-center gap-3 ">
          <div className="flex justify-center mt-2">
            <Image src="/Logocrown.webp" width={200} height={200} alt="logo" />
          </div>
          <div className="flex justify-center mb-10">
            <AuthFormSignup />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
