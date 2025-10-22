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
import { formatTitleCase } from "@/utils/formatTitleCase";
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

    let title;

    // Check if data comes from categoryData.data
    if (categoryData?.data && data === categoryData.data) {
      // Add additional text for category data
      title =
        `${data?.meta_title} ${`${
          LOCALE_LANGUAGE === "en"
            ? `in ${formatTitleCase(dynamicOne)}`
            : `في ${decodeURIComponent(dynamicOne)}`
        }`}` ||
        (isArabic
          ? "معهد لندن كراون للتدريب"
          : "London Crown Institute of Training");
    } else {
      title =
        `${data?.meta_title}` ||
        (isArabic
          ? "معهد لندن كراون للتدريب"
          : "London Crown Institute of Training");
    }

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
        url: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicThree}`,
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

  let courseDetails = null;
  let specializationCategoriesAfterValidation = null;
  let categoryDetails = null;
  let coursesByCategories = null;
  // const checkCity = await fetchCityBySlug({ slug: dynamicOne });

  // console.log(checkCity, "check city");
  // if (!checkCity) {
  //   return notFound();
  // }
  try {
    console.log("Fetching related data based on dynamicOne and dynamicTwo...");
    const results = await Promise.all([
      fetchCourseDetails({ course_slug: decodeURIComponent(dynamicThree) }),
      fetchCoursesByCategoryWithPagination({
        category_slug: decodeURIComponent(dynamicThree),
      }),
      fetchCategoryBySlug({ slug: decodeURIComponent(dynamicThree) }),
    ]);

    if (results[0]) courseDetails = results[0];
    if (results[1]) coursesByCategories = results[1];
    if (results[2]) categoryDetails = results[2];
  } catch (error) {
    console.error("Error fetching dynamicTwo data", error);
  }

  const checkCity = await fetchCityBySlug({ slug: dynamicOne });
  if (courseDetails) {
    console.log("=== Course Details Validation Start ===");
    console.log("Course details found:", {
      courseSlug: courseDetails?.data?.slug,
      categorySlug: courseDetails?.data?.category_slug,
      expectedCategorySlug: dynamicTwo,
      specializationSlug: courseDetails?.data?.specialization_slug,
      expectedSpecializationSlug: dynamicOne,
    });

    // console.log(checkCity, "check city");
    // if (!checkCity) {
    //   return notFound();
    // }
    if (
      !courseDetails ||
      courseDetails?.data?.category_slug !== decodeURIComponent(dynamicTwo) ||
      courseDetails?.data?.specialization_slug !==
        decodeURIComponent(dynamicOne)
    ) {
      console.log("=== Course Validation Failed ===");
      console.log("Validation Details:", {
        hasCourseDetails: !!courseDetails,
        categoryMatch: courseDetails?.data?.category_slug === dynamicTwo,
        specializationMatch:
          courseDetails?.data?.specialization_slug === dynamicOne,
        courseData: courseDetails?.data,
        dynamicParams: {
          dynamicOne,
          dynamicTwo,
          dynamicThree,
        },
      });
      return notFound();
    }

    console.log("=== Course Validation Passed ===");
    console.log("Proceeding with course details:", {
      courseTitle: courseDetails?.data?.title,
      courseSlug: courseDetails?.data?.slug,
      categorySlug: courseDetails?.data?.category_slug,
      specializationSlug: courseDetails?.data?.specialization_slug,
    });

    console.log("Category Details:", {
      categorySpecializationSlug: categoryDetails?.data?.specialization_slug,
      decodedDynamicTwo: decodeURIComponent(dynamicTwo),
    });
  } else if (
    !coursesByCategories ||
    !categoryDetails ||
    !checkCity ||
    categoryDetails?.data?.slug !== decodeURIComponent(dynamicThree) ||
    categoryDetails?.data?.specialization_slug !==
      decodeURIComponent(dynamicTwo)
  ) {
    console.log("=== Category Validation Failed ===");
    console.log("Category Validation Details:", {
      hasCoursesByCategories: !!coursesByCategories,
      hasCategoryDetails: !!categoryDetails,
      categorySlugMatch:
        categoryDetails?.data?.slug === decodeURIComponent(dynamicThree),
      specializationSlugMatch:
        `${categoryDetails?.data?.specialization_slug}` ===
        decodeURIComponent(dynamicTwo),
      categoryData: categoryDetails?.data,
      dynamicParams: {
        dynamicOne,
        dynamicTwo,
        dynamicThree,
      },
    });
    return notFound();
  }

  // if (!courseDetails && !coursesByCategories && !categoryDetails) {
  //   console.log(
  //     "No course details or specialization categories found, returning NotFound."
  //   );
  //   return notFound();
  // }
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
