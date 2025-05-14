import Loading from "@/components/Loading";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchCitiesWithPagination } from "@/requests/city/api";
import React, { Suspense } from "react";
import CityPage from "./CityPage";

export const dynamic = 'force-dynamic';


export async function generateMetadata() {
  const isEnglish = LOCALE_LANGUAGE === "en";

  return isEnglish
    ? {
        title: "Our Top Training Cities",
        description:
          "Explore more than 40 cities options we offer our top training courses, diplomas and mini masters in at the convenience of your location.",
        keywords: "top training venues, top training cities",
        alternates: {
          canonical: `https://clinstitute.co.uk/cities`,
        },
        openGraph: {
          title: "Our Top Training Cities",
          description:
            "Explore more than 40 cities options we offer our top training courses, diplomas and mini masters in at the convenience of your location.",
          url: `https://clinstitute.co.uk/cities`,
          images: [
            {
              url: "https://clinstitute.co.uk/Logocrown.webp",
              width: 800,
              height: 600,
              alt: "Crown Academy Image",
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "Our Top Training Cities",
          description:
            "Explore more than 40 cities options we offer our top training courses, diplomas and mini masters in at the convenience of your location.",
          images: "https://clinstitute.co.uk/Logocrown.webp",
        },
      }
    : {
        title: "أفضل المدن التي نقدم فيها دوراتنا التدريبية",
        description:
          "استكشف أكثر من 40 مدينة نوفر فيها دوراتنا التدريبية الرائدة، الدبلومات، وبرامج الماجستير المصغّرة بما يتناسب مع موقعك وراحتك.",
        keywords: "أفضل أماكن التدريب، أفضل المدن للتدريب",
        alternates: {
          canonical: `https://ar.clinstitute.co.uk/cities`,
        },
        openGraph: {
          title: "أفضل المدن التي نقدم فيها دوراتنا التدريبية",
          description:
            "استكشف أكثر من 40 مدينة نوفر فيها دوراتنا التدريبية الرائدة، الدبلومات، وبرامج الماجستير المصغّرة بما يتناسب مع موقعك وراحتك.",
          url: `https://ar.clinstitute.co.uk/cities`,
          images: [
            {
              url: "https://ar.clinstitute.co.uk/Logocrown.webp",
              width: 800,
              height: 600,
              alt: "صورة أكاديمية كراون",
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: "أفضل المدن التي نقدم فيها دوراتنا التدريبية",
          description:
            "استكشف أكثر من 40 مدينة نوفر فيها دوراتنا التدريبية الرائدة، الدبلومات، وبرامج الماجستير المصغّرة بما يتناسب مع موقعك وراحتك.",
          images: "https://ar.clinstitute.co.uk/Logocrown.webp",
        },
      };
}

// Fetch cities with pagination

const page = async () => {
  const citiesData = await fetchCitiesWithPagination({ page: 1, per_page: 50 });

  // Schema data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "List of Cities - London Crown Institute of Training",
    description: "Browse all available cities offering training courses.",
    url:
      LOCALE_LANGUAGE === "en"
        ? "https://clinstitute.co.uk/cities"
        : "https://ar.clinstitute.co.uk/cities",
    itemListElement: citiesData?.data?.map((city: any, index: any) => ({
      "@type": "ListItem",
      position: index + 1,
      name: city.name,
      url: `${
        LOCALE_LANGUAGE === "en"
          ? "https://clinstitute.co.uk"
          : "https://ar.clinstitute.co.uk"
      }/cities`,
    })),
  };

  return (
    <>
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Suspense fallback={<Loading />}>
        <CityPage data={citiesData} />
      </Suspense>
    </>
  );
};

export default page;
