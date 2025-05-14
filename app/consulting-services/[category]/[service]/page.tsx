import Blogs from "@/components/Blogs";
import Consult_form from "@/components/Consult_form";
import HeroSection from "@/components/HeroSection";
import Wrapper from "@/components/Wrapper";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import {
  fetchConsultationSubCategoryByCategory,
  fetchConsultationSubCategoryBySlug,
} from "@/requests/consultations/api";
import Head from "next/head";
import { notFound } from "next/navigation";

// Types for the fetched data
interface Consultation {
  id: number;
  title: string;
  short: string;
  meta_description: string;
  image: string;
  meta_title: string;
  meta_keywords: string;
  content: string;
}

interface ServiceSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  provider: {
    "@type": string;
    name: string;
    url: string;
  };
  areaServed: {
    "@type": string;
    name: string;
  };
  url: string;
  image: string;
  keywords: string;
  hasOfferCatalog: {
    "@type": string;
    name: string;
    itemListElement: Array<{
      "@type": string;
      itemOffered: {
        "@type": string;
        name: string;
      };
    }>;
  };
}
export const dynamic = 'force-dynamic';
export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; category: string }>;
}) {
  const { service, category } = await params;

  const [consultingData] = await Promise.all([
    fetchConsultationSubCategoryBySlug({ slug: service }),
  ]);
  const data = consultingData?.data;
  console.log(data, "consultingData");

  const isEnglish = LOCALE_LANGUAGE === "en";

  if (!data) {
    return {
      title: isEnglish ? "Page Not Found" : "الصفحة غير موجودة",
      description: isEnglish
        ? "The requested page does not exist."
        : "الصفحة المطلوبة غير موجودة.",
    };
  }

  return {
    title:
      data?.meta_title ||
      (isEnglish
        ? "London Crown Institute of Training"
        : "معهد لندن كراون للتدريب"),
    description:
      data?.meta_description ||
      (isEnglish
        ? "Explore top courses and blogs"
        : "استكشف أفضل الدورات والمدونات"),
    keywords:
      data?.meta_keywords ||
      (isEnglish
        ? "training, courses, blogs, development"
        : "تدريب، دورات، مدونات، تطوير"),
    alternates: {
      canonical: `${DOMAIN_URL}/consulting-services/${category}/${service}`,
    },
    openGraph: {
      title: data?.meta_title,
      description: data?.meta_description,
      url: `${DOMAIN_URL}/consulting-services/${category}/${service}`,
      images: [
        {
          url: data?.image || "/logocrown.webp",
          width: 800,
          height: 600,
          alt: data?.meta_title || (isEnglish ? "Course Image" : "صورة الدورة"),
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.meta_title,
      description: data?.meta_description,
      images: [data?.image || "/logocrown.webp"],
    },
  };
}

const page = async ({
  params,
}: {
  params: Promise<{ service: string; category: string }>;
}) => {
  const { service, category } = await params;
  const details = await fetchConsultationSubCategoryBySlug({ slug: service });
  const isCategoryExist = await fetchConsultationSubCategoryByCategory({
    slug: category,
  });

  const isEnglish = LOCALE_LANGUAGE === "en";

  const serviceSchema: ServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: details?.data?.title,
    description: details?.data?.meta_description || details?.data?.short || "",
    provider: {
      "@type": "Organization",
      name: "London Crown Institute of Training",
      url: DOMAIN_URL,
    },
    areaServed: {
      "@type": "Country",
      name: isEnglish ? "United Kingdom" : "المملكة المتحدة",
    },
    url: `${DOMAIN_URL}/consulting-services/${category}/${service}`,
    image: details?.data?.image || `${DOMAIN_URL}/logocrown.webp`,
    keywords: details?.data?.meta_keywords,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEnglish ? "Consulting Services" : "الخدمات الاستشارية",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: details?.data?.title,
          },
        },
      ],
    },
  };
  // console.log(isCategoryExist, "isCategoryExist");
  if (details === null || isCategoryExist === null) return notFound();

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </Head>
      <div className="overflow-hidden">
        <HeroSection
          parentClassName="md:h-[70dvh] h-[60dvh]"
          imageUrl={"/blog3.png"}
          imageAlt={"Consultations page banner"}
          heading={details?.data?.title}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="h-[1px] bg-secondary w-full text-secondary" />
          </div>
          {details?.data?.content && (
            <div
              dangerouslySetInnerHTML={{ __html: details?.data?.content }}
              suppressHydrationWarning
              className="text-base text-primary"
            ></div>
          )}

          <TranslatedText
            as="h2"
            className="text-2xl text-primary font-bold mb-3 text-center mt-32"
            ns="common"
            textKey="consultation.consultSection.heading"
          />
          <div className="h-[2px] bg-secondary w-full text-secondary" />
          <TranslatedText
            as="p"
            ns="common"
            textKey="consultation.consultSection.subtitle"
            className="text-center text-primary mt-3 text-base"
          />
        </main>
        <div className="-mt-4 text-base">
          <Wrapper full={true}>
            <Consult_form title={details?.data?.title} />
          </Wrapper>
        </div>

        <Blogs />
      </div>
    </>
  );
};

export default page;
