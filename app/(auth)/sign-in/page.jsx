import AuthForm from "@/components/AuthForm";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import Image from "next/image";

export function generateMetadata() {
  const metadataEn = {
    title: "Login - London Crown Institute of Training",
    description:
      "Access your account at London Crown Institute of Training. Log in to manage your courses, track progress, and stay updated with our latest training programs.",
    openGraph: {
      title: "Login - London Crown Institute of Training",
      description:
        "Access your account at London Crown Institute of Training. Log in to manage your courses, track progress, and stay updated with our latest training programs.",
      url: `${DOMAIN_URL}/sign-in`,
      type: "website",
      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
          width: 1200,
          height: 630,
          alt: "Login - London Crown Institute of Training",
        },
      ],
    },
    alternates: {
      canonical:`${DOMAIN_URL}/sign-in`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Login - London Crown Institute of Training",
      description:
        "Access your account at London Crown Institute of Training. Log in to manage your courses, track progress, and stay updated with our latest training programs.",
      images: `${DOMAIN_URL}/Logocrown.webp`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  const metadataAr = {
    title: "تسجيل الدخول - معهد لندن كراون للتدريب",
    description:
      "قم بتسجيل الدخول إلى حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
    openGraph: {
      title: "تسجيل الدخول - معهد لندن كراون للتدريب",
      description:
        "قم بتسجيل الدخول إلى حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
      url: "https://ar.clinstitute.co.uk/sign-in",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "تسجيل الدخول - معهد لندن كراون للتدريب",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "تسجيل الدخول - معهد لندن كراون للتدريب",
      description:
        "قم بتسجيل الدخول إلى حسابك في معهد لندن كراون للتدريب لإدارة الدورات، وتتبع التقدم، والبقاء على اطلاع على أحدث البرامج التدريبية.",
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
      <section className="flex justify-center mt-10 size-full rounded-3xl max-sm:px-6">
        <Image
          src="/sign.webp"
          alt="signin"
          className="hidden h-[400px] w-[400px] object-cover m-20 rounded-3xl md:block"
          layout="responsive" // Use intrinsic layout to manage dimensions through the CSS
          height={300} // These values are optional but can help with preloading
          width={300}
        />

        <div className="flex flex-col items-center justify-center gap-3 md:mx-20">
          <div className="flex justify-center mt-2">
            <Image src="/Logocrown.webp" width={200} height={200} alt="logo" />
          </div>
          <div className="flex justify-center mb-10 ">
            <AuthForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
