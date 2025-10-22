import { DOMAIN_URL, LOCALE_LANGUAGE } from "./apiUrl";
import { TEXT } from "./text";

export const generateCourseDetailCrumbsJsonLdData = ({
  course,
  cityPath = false,
  cityParams = "",
}: {
  course: any;
  cityPath?: boolean;
  cityParams?: string;
}) => {
  return {
    ItemList: {
      "@context": "https://schema.org",
      "@type": "Course",
      name:
        `${course?.title}${
          cityPath
            ? ` ${`${LOCALE_LANGUAGE === "en" ? "in" : "في"} ${
                course?.available_cities?.find(
                  (city: any) => city?.slug === decodeURIComponent(cityParams)
                )?.name
              }`}`
            : ""
        }` || "",
      description: course?.meta_description || "",
      url: cityPath
        ? `${DOMAIN_URL}${cityParams !== "" && `/${cityParams}`}/${
            course?.specialization_slug
          }/${course?.category_slug}/${course?.slug}`
        : `${DOMAIN_URL}/${course?.specialization_slug}/${course?.category_slug}/${course?.slug}`,
      educationalCredentialAwarded: course?.category || "",
      provider: {
        "@type": "Organization",
        name: TEXT?.INSTITUTE_NAME,
        sameAs: DOMAIN_URL,
      },
      image: {
        "@type": "ImageObject",
        url: course?.image || course?.featured_image || "",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: LOCALE_LANGUAGE === "en" ? "Onsite" : "حضوري",
        courseWorkload: LOCALE_LANGUAGE === "en" ? "PT22H" : "٢٢ ساعة",
        courseSchedule: {
          "@type": "Schedule",
          duration: LOCALE_LANGUAGE === "en" ? "P1W" : "أسبوع",
          repeatCount: "1",
          repeatFrequency: LOCALE_LANGUAGE === "en" ? "Weekly" : "أسبوعيًا",
          startDate: course?.available_dates?.[0]?.date || "",
          endDate:
            course?.available_dates?.[1]?.date ||
            course?.available_dates?.[0]?.date ||
            "",
        },
        location: {
          "@type": "Place",
          name: cityPath
            ? course?.available_cities?.find(
                (city: any) => city.slug === decodeURIComponent(cityParams)
              )?.name
            : course?.available_cities
                ?.map((city: any) => city?.name)
                .join(", ") || "",
        },
      },
      offers: {
        "@type": "Offer",
        category: LOCALE_LANGUAGE === "en" ? "Paid" : "مدفوع",
        price: course?.price || "",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        validFrom: course?.available_dates?.[0]?.date || "",
      },
      review: {
        "@type": "Review",
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          "@type": "Person",
          name: LOCALE_LANGUAGE === "en" ? "Admin" : "المسؤول",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4.6",
        },
      },
    },
  };
};
