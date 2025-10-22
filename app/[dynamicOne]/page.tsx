// import City from "@/components/City";
// import Loading from "@/components/Loading";
// import Programs from "@/components/Programs";
// import Specialization from "@/components/Specialization";
// import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
// import {
//   fetchCategories,
//   fetchCategoryBySpecialization,
// } from "@/requests/categories/api";
// import { fetchCityBySlug } from "@/requests/city/api";
// import {
//   fetchCoursesByCityWithPagination,
//   fetchCoursesByProgramWithPagination,
// } from "@/requests/courses/api";
// import { fetchProgramBySlug } from "@/requests/programs/api";
// import { fetchSpecializationBySlug } from "@/requests/specializations/api";
// import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";
// import { unstable_cache } from "next/cache";

// // Set revalidation period for cached data (e.g., 3600 seconds = 1 hour)
// const REVALIDATION_TIME = 3600;

// // Create cached versions of your API functions
// const cachedFetchCityBySlug = unstable_cache(
//   async (slug) => fetchCityBySlug({ slug }),
//   ["city-by-slug"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchProgramBySlug = unstable_cache(
//   async (slug) => fetchProgramBySlug({ slug }),
//   ["program-by-slug"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchSpecializationBySlug = unstable_cache(
//   async (slug) => fetchSpecializationBySlug({ slug }),
//   ["specialization-by-slug"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchCoursesByCityWithPagination = unstable_cache(
//   async (params) => fetchCoursesByCityWithPagination(params),
//   ["courses-by-city"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchCoursesByProgramWithPagination = unstable_cache(
//   async (params) => fetchCoursesByProgramWithPagination(params),
//   ["courses-by-program"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchCategories = unstable_cache(
//   async () => fetchCategories(),
//   ["categories"],
//   { revalidate: REVALIDATION_TIME }
// );

// const cachedFetchCategoryBySpecialization = unstable_cache(
//   async (params) => fetchCategoryBySpecialization(params),
//   ["category-by-specialization"],
//   { revalidate: REVALIDATION_TIME }
// );

// export const dynamic = "force-dynamic";

// // Keep static metadata as is
// const staticMetaData = {
//   "training-courses": {
//     metaTitle: "Professional Training Courses",
//     metaKeywords:
//       "training courses in London, professional training courses, short courses, London Crown Institute of Training, UK training institute",
//     metaDes:
//       "Explore top-rated training courses at London Crown Institute of Training and boost your profession with expert-led, practical learning programs in London.",
//   },
//   "الدورات-التدريبية": {
//     metaTitle: "دورات تدريبية احترافية",
//     metaKeywords:
//       "دورات تدريبية في لندن، دورات احترافية، دورات قصيرة، معهد لندن كراون للتدريب، معهد تدريب في المملكة المتحدة",
//     metaDes:
//       "استكشف أفضل الدورات التدريبية في معهد لندن كراون للتدريب وطور مهاراتك المهنية من خلال برامج تعليمية عملية يقودها خبراء في لندن.",
//   },
//   diploma: {
//     metaTitle: "Short Diploma Training Programs",
//     metaKeywords:
//       "diploma courses London, accredited diplomas UK, professional diploma programs, London Crown Institute of Training, diploma training",
//     metaDes:
//       "Explore range of top diploma courses at London Crown Institute of Training and gain practical skills to advance your career in London and beyond.",
//   },
//   دبلوم: {
//     metaTitle: "برامج تدريب دبلوم قصيرة",
//     metaKeywords:
//       "دورات دبلوم في لندن، دبلومات معتمدة في المملكة المتحدة، برامج دبلوم احترافية، معهد لندن كراون للتدريب، تدريب دبلوم",
//     metaDes:
//       "استكشف مجموعة من أفضل دورات الدبلوم في معهد لندن كراون للتدريب واكتسب مهارات عملية تساعدك على التقدم في مسيرتك المهنية داخل لندن وخارجها.",
//   },
//   masters: {
//     metaTitle: "Short Masters Training Programs",
//     metaKeywords:
//       "masters courses London, advanced training programs, executive masters UK, London Crown Institute of Training, postgraduate training",
//     metaDes:
//       "Enroll in advanced short masters programs at London Crown Institute of Training to achieve academic and professional excellence in your field.",
//   },
//   الماجستير: {
//     metaTitle: "برامج تدريب ماجستير قصيرة",
//     metaKeywords:
//       "دورات ماجستير في لندن، برامج تدريب متقدمة، ماجستير تنفيذي في المملكة المتحدة، معهد لندن كراون للتدريب، تدريب دراسات عليا",
//     metaDes:
//       "سجّل في برامج الماجستير القصيرة والمتقدمة في معهد لندن كراون للتدريب لتحقيق التميز الأكاديمي والمهني في مجالك.",
//   },
//   cities: {
//     metaTitle: "Our Top Training Cities",
//     metaKeywords: "top training venues, top training cities",
//     metaDes:
//       "Explore more than 40 cities options we offer our top training courses, diplomas and mini masters in at the convenience of your location.",
//   },
//   "cities-ar": {
//     metaTitle: "أفضل المدن التي نقدم فيها دوراتنا التدريبية",
//     metaKeywords: "أفضل أماكن التدريب، أفضل المدن للتدريب",
//     metaDes:
//       "استكشف أكثر من 40 مدينة نوفر فيها دوراتنا التدريبية الرائدة، الدبلومات، وبرامج الماجستير المصغّرة بما يتناسب مع موقعك وراحتك.",
//   },
// } as any;

// // Data fetching utility to centralize fetching logic and avoid duplication
// async function fetchPageData(slug: string) {
//   // Check if it's a static route first
//   const normalizedSlug =
//     LOCALE_LANGUAGE === "en" ? slug : decodeURIComponent(slug);
//   if (staticMetaData[normalizedSlug]) {
//     return {
//       type: "static",
//       data: staticMetaData[normalizedSlug],
//     };
//   }

//   // Try to fetch data with a smart approach to avoid throttling
//   try {
//     // Start with sequential fetching of the main entity (city, program, or specialization)
//     // This reduces the number of parallel requests
//     let city = await cachedFetchCityBySlug(slug).catch(() => null);

//     // If city is found, fetch required city data
//     if (city?.data) {
//       const [cityCourses, categoriesForCityPage] = await Promise.all([
//         cachedFetchCoursesByCityWithPagination({
//           city_slug: slug,
//           page: 1,
//           per_page: 50,
//         }),
//         cachedFetchCategories(),
//       ]);

//       return {
//         type: "city",
//         city,
//         cityCourses,
//         categoriesForCityPage,
//       };
//     }

//     // Try program if city wasn't found
//     let program = await cachedFetchProgramBySlug(slug).catch(() => null);
//     if (program) {
//       const programCourses = await cachedFetchCoursesByProgramWithPagination({
//         program_slug: slug,
//         page: 1,
//         per_page: 50,
//       });

//       return {
//         type: "program",
//         program,
//         programCourses,
//       };
//     }

//     // Try specialization if neither city nor program was found
//     let specialization = await cachedFetchSpecializationBySlug(slug).catch(
//       () => null
//     );
//     if (specialization?.data) {
//       const specializationCategories =
//         await cachedFetchCategoryBySpecialization({
//           slug,
//           per_page: 50,
//           page: 1,
//         });

//       return {
//         type: "specialization",
//         specialization,
//         specializationCategories,
//       };
//     }

//     // If nothing was found, return null
//     return null;
//   } catch (error) {
//     console.error("Error fetching page data:", error);
//     return null;
//   }
// }

// // Store page data in a React cache for reuse between metadata and component
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ dynamicOne: string }>;
// }): Promise<Metadata> {
//   const isEnglish = LOCALE_LANGUAGE === "en";
//   const { dynamicOne } = await params;

//   // Fetch data using our centralized function
//   const pageData = await fetchPageData(dynamicOne);

//   // Handle static routes
//   if (pageData?.type === "static") {
//     const meta = pageData.data;
//     return {
//       title: meta?.metaTitle,
//       description: meta?.metaDes,
//       keywords: meta?.metaKeywords,
//       openGraph: {
//         title: meta?.metaTitle,
//         description: meta?.metaDes,
//         url: `${DOMAIN_URL}/${dynamicOne}`,
//         images: "/Logocrown.webp",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: meta?.metaTitle,
//         description: meta?.metaDes,
//         images: ["/Logocrown.webp"],
//       },
//       alternates: {
//         canonical: `${DOMAIN_URL}/${dynamicOne}`,
//       },
//     };
//   }

//   // If no valid data was found
//   if (
//     !pageData ||
//     (!pageData.city && !pageData.program && !pageData.specialization)
//   ) {
//     return {
//       title: isEnglish
//         ? "Page Not Found - London Crown Institute of Training"
//         : "الصفحة غير موجودة - معهد لندن كراون للتدريب",
//       description: isEnglish
//         ? "The requested page could not be found."
//         : "لم يتم العثور على الصفحة المطلوبة.",
//     };
//   }

//   // Get the relevant data based on the page type
//   const data =
//     pageData.city?.data || pageData.specialization?.data || pageData.program;

//   return {
//     title: `${
//       data?.meta_title ||
//       (isEnglish
//         ? "London Crown Institute of Training"
//         : "معهد لندن كراون للتدريب")
//     }`,
//     description:
//       data?.meta_description ||
//       (isEnglish
//         ? `Explore the top courses in ${data.name} at London Crown Institute of Training.`
//         : `استكشف أفضل الدورات في ${data.name} في معهد لندن كراون للتدريب.`),
//     keywords:
//       data?.meta_keywords ||
//       (isEnglish
//         ? "training, courses, programs, specialization"
//         : "تدريب، دورات، برامج، تخصصات"),
//     openGraph: {
//       title: data?.meta_title || data.name,
//       description: data?.meta_description,
//       url: `${DOMAIN_URL}/${dynamicOne}`,
//       images: data?.image || "/Logocrown.webp",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: data?.meta_title || data.name,
//       description: data?.meta_description,
//       images: [data?.image || "/Logocrown.webp"],
//     },
//     alternates: {
//       canonical: `${DOMAIN_URL}/${dynamicOne}`,
//     },
//   };
// }

// export default async function DynamicOne({
//   params,
// }: {
//   params: Promise<{ dynamicOne: string }>;
// }) {
//   const { dynamicOne } = await params;
//   const slug =
//     LOCALE_LANGUAGE === "en" ? dynamicOne : decodeURIComponent(dynamicOne);

//   // Fetch page data using the centralized function
//   const pageData = await fetchPageData(dynamicOne);

//   // Handle 404 case
//   if (
//     !pageData ||
//     (pageData.type !== "static" &&
//       !pageData.city &&
//       !pageData.program &&
//       !pageData.specialization)
//   ) {
//     return notFound();
//   }

//   // Render the appropriate component based on the data type
//   if (pageData.type === "city") {
//     return (
//       <Suspense fallback={<Loading />}>
//         <City
//           params={dynamicOne}
//           city={pageData.city}
//           data={pageData.cityCourses}
//           check_city_courses={true}
//           category={pageData.categoriesForCityPage}
//         />
//       </Suspense>
//     );
//   }

//   if (pageData.type === "program") {
//     return (
//       <Suspense fallback={<Loading />}>
//         <Programs
//           params={dynamicOne}
//           program={staticMetaData[slug] || null}
//           data={pageData.programCourses}
//         />
//       </Suspense>
//     );
//   }

//   if (pageData.type === "specialization") {
//     return (
//       <Specialization
//         data={pageData.specializationCategories}
//         params={dynamicOne}
//         specialization={pageData.specialization}
//         city={false}
//       />
//     );
//   }

//   // Fallback
//   return notFound();
// }
import City from "@/components/City";
import Loading from "@/components/Loading";
import Programs from "@/components/Programs";
import Specialization from "@/components/Specialization";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import {
  fetchCategories,
  fetchCategoryBySpecialization,
} from "@/requests/categories/api";
import { fetchCityBySlug } from "@/requests/city/api";
import {
  fetchCoursesByCityWithPagination,
  fetchCoursesByProgramWithPagination,
} from "@/requests/courses/api";
import { fetchProgramBySlug } from "@/requests/programs/api";
import { fetchSpecializationBySlug } from "@/requests/specializations/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const staticMetaData: any = {
  "training-courses": {
    metaTitle: "Professional Training Courses",
    metaKeywords:
      "training courses in London, professional training courses, short courses, London Crown Institute of Training, UK training institute",
    metaDes:
      "Explore top-rated training courses at London Crown Institute of Training and boost your profession with expert-led, practical learning programs in London.",
  },
  "الدورات-التدريبية": {
    metaTitle: "دورات تدريبية احترافية",
    metaKeywords:
      "دورات تدريبية في لندن، دورات احترافية، دورات قصيرة، معهد لندن كراون للتدريب، معهد تدريب في المملكة المتحدة",
    metaDes:
      "استكشف أفضل الدورات التدريبية في معهد لندن كراون للتدريب وطور مهاراتك المهنية من خلال برامج تعليمية عملية يقودها خبراء في لندن.",
  },
  diploma: {
    metaTitle: "Short Diploma Training Programs",
    metaKeywords:
      "diploma courses London, accredited diplomas UK, professional diploma programs, London Crown Institute of Training, diploma training",
    metaDes:
      "Explore range of top diploma courses at London Crown Institute of Training and gain practical skills to advance your career in London and beyond.",
  },
  دبلوم: {
    metaTitle: "برامج تدريب دبلوم قصيرة",
    metaKeywords:
      "دورات دبلوم في لندن، دبلومات معتمدة في المملكة المتحدة، برامج دبلوم احترافية، معهد لندن كراون للتدريب، تدريب دبلوم",
    metaDes:
      "استكشف مجموعة من أفضل دورات الدبلوم في معهد لندن كراون للتدريب واكتسب مهارات عملية تساعدك على التقدم في مسيرتك المهنية داخل لندن وخارجها.",
  },
  masters: {
    metaTitle: "Short Masters Training Programs",
    metaKeywords:
      "masters courses London, advanced training programs, executive masters UK, London Crown Institute of Training, postgraduate training",
    metaDes:
      "Enroll in advanced short masters programs at London Crown Institute of Training to achieve academic and professional excellence in your field.",
  },
  الماجستير: {
    metaTitle: "برامج تدريب ماجستير قصيرة",
    metaKeywords:
      "دورات ماجستير في لندن، برامج تدريب متقدمة، ماجستير تنفيذي في المملكة المتحدة، معهد لندن كراون للتدريب، تدريب دراسات عليا",
    metaDes:
      "سجّل في برامج الماجستير القصيرة والمتقدمة في معهد لندن كراون للتدريب لتحقيق التميز الأكاديمي والمهني في مجالك.",
  },
  cities: {
    metaTitle: "Our Top Training Cities",
    metaKeywords: "top training venues, top training cities",
    metaDes:
      "Explore more than 40 cities options we offer our top training courses, diplomas and mini masters in at the convenience of your location.",
  },
  "cities-ar": {
    metaTitle: "أفضل المدن التي نقدم فيها دوراتنا التدريبية",
    metaKeywords: "أفضل أماكن التدريب، أفضل المدن للتدريب",
    metaDes:
      "استكشف أكثر من 40 مدينة نوفر فيها دوراتنا التدريبية الرائدة، الدبلومات، وبرامج الماجستير المصغّرة بما يتناسب مع موقعك وراحتك.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dynamicOne: string }>;
}): Promise<Metadata> {
  const isEnglish = LOCALE_LANGUAGE === "en";
  const { dynamicOne } = await params;
  const slug =
    LOCALE_LANGUAGE === "en" ? dynamicOne : decodeURIComponent(dynamicOne);
  // Check if dynamicOne is one of our static routes
  if (staticMetaData[slug]) {
    const meta = staticMetaData[slug];
    console.log(meta, "meta");
    return {
      title: meta?.metaTitle,
      description: meta?.metaDes,
      keywords: meta?.metaKeywords,
      openGraph: {
        title: meta?.metaTitle,
        description: meta?.metaDes,
        url: `${DOMAIN_URL}/${dynamicOne}`,
        images: "/Logocrown.webp",
      },
      twitter: {
        card: "summary_large_image",
        title: meta?.metaTitle,
        description: meta?.metaDes,
        images: ["/Logocrown.webp"],
      },
      alternates: {
        canonical: `${DOMAIN_URL}/${dynamicOne}`,
      },
    };
  }

  // If not a static route, continue with the dynamic metadata logic
  let city = null;
  let program = null;
  let specialization = null;

  try {
    [city, program, specialization] = await Promise.all([
      fetchCityBySlug({ slug: dynamicOne }),
      fetchProgramBySlug({ slug: dynamicOne }),
      fetchSpecializationBySlug({ slug: dynamicOne }),
    ]);
  } catch {
    // Handle silently
  }

  const data = city?.data || specialization?.data || program;

  if (!data) {
    return {
      title: isEnglish
        ? "Page Not Found - London Crown Institute of Training"
        : "الصفحة غير موجودة - معهد لندن كراون للتدريب",
      description: isEnglish
        ? "The requested page could not be found."
        : "لم يتم العثور على الصفحة المطلوبة.",
    };
  }

  return {
    title: `${
      data?.meta_title ||
      (isEnglish
        ? "London Crown Institute of Training"
        : "معهد لندن كراون للتدريب")
    }`,
    description:
      data?.meta_description ||
      (isEnglish
        ? `Explore the top courses in ${data.name} at London Crown Institute of Training.`
        : `استكشف أفضل الدورات في ${data.name} في معهد لندن كراون للتدريب.`),
    keywords:
      data?.meta_keywords ||
      (isEnglish
        ? "training, courses, programs, specialization"
        : "تدريب، دورات، برامج، تخصصات"),
    openGraph: {
      title: data?.meta_title || data.name,
      description: data?.meta_description,
      url: `${DOMAIN_URL}/${dynamicOne}`,
      images: data?.image || "/Logocrown.webp",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.meta_title || data.name,
      description: data?.meta_description,
      images: [data?.image || "/Logocrown.webp"],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/${dynamicOne}`,
    },
  };
}

export default async function DynamicOne({
  params,
}: {
  params: Promise<{ dynamicOne: string }>;
}) {
  const { dynamicOne } = await params;

  let city = null;
  let program = null;
  let specialization = null;

  try {
    [city, program, specialization] = await Promise.all([
      fetchCityBySlug({ slug: dynamicOne }),
      fetchProgramBySlug({ slug: dynamicOne }),
      fetchSpecializationBySlug({ slug: dynamicOne }),
    ]);
  } catch {
    // Handle silently
  }

  let cityCourses: any = null;
  let categoriesForCityPage: any = null;

  let programCourses: any = null;

  let specializationCategories: any = null;
  try {
    if (city) {
      cityCourses = await fetchCoursesByCityWithPagination({
        city_slug: dynamicOne,
        page: 1,
        per_page: 50,
      });
      categoriesForCityPage = await fetchCategories();
    }

    if (program) {
      programCourses = await fetchCoursesByProgramWithPagination({
        program_slug: dynamicOne,
        page: 1,
        per_page: 50,
      });
    }

    if (specialization) {
      specializationCategories = await fetchCategoryBySpecialization({
        slug: dynamicOne,
        per_page: 50,
        page: 1,
      });
    }
  } catch {
    // Handle silently
  }

  if (!city && !program && !specialization) {
    return notFound();
  }
  const slug =
    LOCALE_LANGUAGE === "en" ? dynamicOne : decodeURIComponent(dynamicOne);

  return (
    <>
      {city ? (
        <Suspense fallback={<Loading />}>
          <City
            params={slug}
            city={city}
            data={cityCourses}
            check_city_courses={true}
            category={categoriesForCityPage}
            hideDropdown={true}
          />
        </Suspense>
      ) : program ? (
        <Suspense fallback={<Loading />}>
          <Programs
            params={dynamicOne}
            program={staticMetaData[slug] || null}
            data={programCourses}
          />
        </Suspense>
      ) : specialization ? (
        <Specialization
          data={specializationCategories}
          params={dynamicOne}
          specialization={specialization}
          city={false}
        />
      ) : (
        notFound()
      )}
    </>
  );
}
