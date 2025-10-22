import Blogs from "@/components/Blogs";
import Category from "@/components/Category";
import CourseDetal from "@/components/CourseDetail";
import HeroSection from "@/components/HeroSection";
import Loading from "@/components/Loading";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchCategoryBySlug } from "@/requests/categories/api";
import { fetchCityBySlug } from "@/requests/city/api";
import {
  fetchCourseDetails,
  fetchCoursesByCategoryWithPagination,
} from "@/requests/courses/api";
import { fetchSpecializationBySlug } from "@/requests/specializations/api";
import { formatSlug } from "@/utils/formatSlug";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    dynamicOne: string;
    dynamicTwo: string;
    dynamicThree: string;
  }>;
}): Promise<Metadata> {
  const isArabic = LOCALE_LANGUAGE === "ar"; // Check if the locale is Arabic

  const { dynamicOne, dynamicTwo, dynamicThree } = await params;

  try {
    // Fetch only the data needed for metadata
    const [courseData, categoryData] = await Promise.all([
      fetchCourseDetails({ course_slug: dynamicThree }),
      fetchCategoryBySlug({ slug: dynamicThree }),
    ]);

    // Use the first valid data found
    const data = courseData?.data || categoryData?.data;
    // console.log(data, "meta data");
    if (!data) {
      console.warn("No data found for metadata generation");
      return {
        title: isArabic ? "الصفحة غير موجودة" : "Page Not Found",
        description: isArabic
          ? "الصفحة المطلوبة غير موجودة."
          : "The requested page does not exist.",
      };
    }

    const formattedLocation = formatSlug(dynamicTwo);
    const title =
      `${data?.meta_title} ` ||
      (isArabic
        ? "معهد لندن كراون للتدريب"
        : "London Crown Institute of Training");

    console.log(`Generated metadata title: ${title}`);

    return {
      title,
      description:
        data.meta_description ||
        (isArabic
          ? "اكتشف البرامج التدريبية والدورات المتخصصة."
          : "Discover specialized courses and training programs."),
      keywords:
        data.meta_keywords ||
        (isArabic
          ? "دورات, تخصص, تدريب, برامج"
          : "courses, specialization, training, programs"),
      alternates: {
        canonical: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicThree}`,
      },
      openGraph: {
        title,
        description:
          data.meta_description ||
          (isArabic
            ? "اكتشف برامج التدريب والدورات التدريبية المتميزة."
            : "Explore top-notch training programs and courses."),
        url: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}`,
        images: [
          {
            url: data.image || `${DOMAIN_URL}/Logocrown.webp`,
            width: 800,
            height: 600,
            alt: data.meta_title || (isArabic ? "صورة الدورة" : "Course Image"),
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title:
          `${data.meta_title} ${isArabic ? "في" : "In"} ${formattedLocation}` ||
          (isArabic
            ? "معهد لندن كراون للتدريب"
            : "London Crown Institute of Training"),
        description:
          data.meta_description ||
          (isArabic
            ? "اكتشف البرامج التدريبية المتخصصة والدورات."
            : "Explore specialized training programs and courses."),
        images: [data.image || `${DOMAIN_URL}/Logocrown.webp`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return fallback metadata on error
    return {
      title: isArabic
        ? "معهد لندن كراون للتدريب"
        : "London Crown Institute of Training",
      description: isArabic
        ? "اكتشف البرامج التدريبية والدورات المتخصصة."
        : "Discover specialized courses and training programs.",
    };
  }
}

export default async function DynamicThree({
  params,
  searchParams,
}: {
  params: Promise<{
    dynamicOne: string;
    dynamicTwo: string;
    dynamicThree: string;
  }>;
  searchParams: Promise<{ page: number; per_page: number }>;
}) {
  console.log("Fetching dynamic parameters...");
  const { dynamicOne, dynamicTwo, dynamicThree } = await params;

  console.log(
    `Received dynamic slugs: dynamicOne=${dynamicOne}, dynamicTwo=${dynamicTwo}, dynamicThree=${dynamicThree}`
  );

  // Step 1: Validate dynamicOne first
  let city = null;
  let specialization = null;

  try {
    console.log("Validating dynamicOne...");
    [city, specialization] = await Promise.all([
      fetchCityBySlug({ slug: dynamicOne }),
      fetchSpecializationBySlug({ slug: dynamicOne }),
    ]);
    console.log(
      `Validated dynamicOne: city=${city}, specialization=${specialization}`
    );
  } catch (error) {
    console.error("Error validating dynamicOne", error);
  }

  let isSpecialExist = null;
  let isCategoryExist = null;

  try {
    console.log("Validating dynamicTwo...");
    [isSpecialExist, isCategoryExist] = await Promise.all([
      fetchSpecializationBySlug({ slug: dynamicTwo }),
      fetchCategoryBySlug({ slug: dynamicTwo }),
    ]);
    console.log(
      `Validated dynamicTwo: isSpecialExist=${isSpecialExist}, isCategoryExist=${isCategoryExist}`
    );
  } catch (error) {
    console.error("Error validating dynamicTwo", error);
  }

  // If none of the slugs from dynamicOne are valid, return NotFound
  if (!city && !specialization) {
    console.log(
      "Neither city nor specialization found for dynamicOne, returning NotFound."
    );
    return notFound();
  }

  // If neither specialization nor category exists for dynamicTwo, return NotFound
  if (!isSpecialExist && !isCategoryExist) {
    console.log(
      "Neither specialization nor category found for dynamicTwo, returning NotFound."
    );
    return notFound();
  }

  const isExistOne = specialization && isCategoryExist;
  const isExistTwo = city && isSpecialExist;
  let courseDetails = null;

  // Step 2: Fetch data related to dynamicTwo
  let specializationCategoriesAfterValidation = null;
  let categoryDetails = null;
  let coursesByCategories = null;

  try {
    console.log("Fetching related data based on dynamicOne and dynamicTwo...");
    const results = await Promise.all([
      isExistOne ? fetchCourseDetails({ course_slug: dynamicThree }) : null,
      isExistTwo
        ? fetchCoursesByCategoryWithPagination({ category_slug: dynamicThree })
        : null,
      isExistTwo ? fetchCategoryBySlug({ slug: dynamicThree }) : null,
      // specialization
      //   ? fetchCoursesByCategoryWithPagination({
      //       category_slug: dynamicTwo,
      //       per_page: (await searchParams).per_page ?? 50,
      //       page: (await searchParams).page ?? 1,
      //     })
      //   : null,
    ]);

    console.log("Fetched results:", results);

    if (results[0]) courseDetails = results[0];
    if (results[1]) coursesByCategories = results[1];
    if (results[2]) categoryDetails = results[2];
    // if (results[3]) coursesByCategories = results[3];
  } catch (error) {
    console.error("Error fetching dynamicTwo data", error);
  }

  // Debug logs for fetched data
  console.log("courseDetails:", courseDetails);
  console.log("specializationCategoriesAfterValidation:", coursesByCategories);

  if (!courseDetails && !coursesByCategories && !categoryDetails) {
    console.log(
      "No course details or specialization categories found, returning NotFound."
    );
    return notFound();
  }

  // Final rendering logic
  return (
    <>
      {courseDetails ? (
        <>
          <HeroSection
            imageUrl={courseDetails?.data?.image}
            heading={courseDetails?.data?.title}
          />

          <Suspense fallback={<Loading />}>
            <CourseDetal
              course={courseDetails?.data}
              params={dynamicThree}
              isCity={false}
            />
          </Suspense>

          <Blogs />
        </>
      ) : (
        <>
          <Category
            course={coursesByCategories}
            categoryDetail={categoryDetails}
            params={dynamicThree}
            cityParams={
              LOCALE_LANGUAGE === "en"
                ? dynamicOne
                : decodeURIComponent(dynamicOne)
            }
            cityPath={true}
            hideDropdown={true}
          />
        </>
      )}
    </>
  );
}
