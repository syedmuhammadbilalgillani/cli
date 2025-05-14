import Category from "@/components/Category";
import Specialization from "@/components/Specialization";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import {
  fetchCategoryBySlug,
  fetchCategoryBySpecialization,
} from "@/requests/categories/api";
import { fetchCityBySlug } from "@/requests/city/api";
import { fetchCoursesByCategoryWithPagination } from "@/requests/courses/api";
import { fetchSpecializationBySlug } from "@/requests/specializations/api";
import { formatSlug } from "@/utils/formatSlug";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dynamicOne: string; dynamicTwo: string }>;
}): Promise<Metadata> {
  const isEnglish = LOCALE_LANGUAGE === "en";

  const { dynamicOne, dynamicTwo } = await params;

  try {
    // Fetch only the data needed for metadata
    const [courseData, categoryData] = await Promise.all([
      fetchSpecializationBySlug({ slug: dynamicTwo }),
      fetchCategoryBySlug({ slug: dynamicTwo }),
    ]);

    // Use the first valid data found
    const data = courseData?.data || categoryData?.data;
    // console.log(data, "meta data");
    if (!data) {
      console.warn("No data found for metadata generation");
      return {
        title: "Page Not Found",
        description: "The requested page does not exist.",
      };
    }

    const formattedLocation = formatSlug(dynamicTwo);
    const title = `${data.meta_title}` || "London Crown Institute of Training";

    console.log(`Generated metadata title: ${title}`);

    return {
      title,
      description:
        data.meta_description ||
        "Discover specialized courses and training programs.",
      keywords:
        data.meta_keywords || "courses, specialization, training, programs",
      alternates: {
        canonical: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}`,
      },
      openGraph: {
        title,
        description:
          data.meta_description ||
          "Explore top-notch training programs and courses.",
        url: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}`,
        images: [
          {
            url: data.image || `${DOMAIN_URL}/Logocrown.webp`,
            width: 800,
            height: 600,
            alt: data.meta_title || "Course Image",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title:
          `${data.meta_title} In ${formattedLocation}` ||
          "London Crown Institute of Training",
        description:
          data.meta_description ||
          "Explore specialized training programs and courses.",
        images: [data.image || `${DOMAIN_URL}/Logocrown.webp`],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return fallback metadata on error
    return {
      title: "London Crown Institute of Training",
      description: "Discover specialized courses and training programs.",
    };
  }
}

export default async function DynamicOne({
  params,
  searchParams,
}: {
  params: Promise<{ dynamicOne: string; dynamicTwo: string }>;
  searchParams: Promise<{ page: number; per_page: number }>;
}) {
  const { dynamicOne, dynamicTwo } = await params;

  // Step 1: Validate dynamicOne first
  let city = null;
  let specialization = null;

  try {
    [city, specialization] = await Promise.all([
      fetchCityBySlug({ slug: dynamicOne }),
      fetchSpecializationBySlug({ slug: dynamicOne }),
    ]);
  } catch (error) {
    console.error("Error validating dynamicOne", error);
  }
  console.log(specialization, "specialization");
  // If none of the slugs from dynamicOne are valid, return NotFound
  if (!city && !specialization) {
    return notFound();
  }

  // Step 2: Fetch data related to dynamicTwo
  let specializationCategoriesAfterValidation = null;
  let categoryDetails = null;
  let coursesByCategories = null;

  try {
    // Only fetch relevant data based on what was found in dynamicOne
    const results = await Promise.all([
      city ? fetchSpecializationBySlug({ slug: dynamicTwo }) : null,
      city ? fetchCategoryBySpecialization({ slug: dynamicTwo }) : null,
      specialization ? fetchCategoryBySlug({ slug: dynamicTwo }) : null,
      specialization
        ? fetchCoursesByCategoryWithPagination({
            category_slug: dynamicTwo,
            per_page: (await searchParams).per_page ?? 50,
            page: (await searchParams).page ?? 1,
          })
        : null,
    ]);

    // Overwrite city/program/specialization if dynamicTwo represents one

    if (results[0]) specialization = results[0];
    if (results[1]) specializationCategoriesAfterValidation = results[1];
    if (results[2]) categoryDetails = results[2];
    if (results[3]) coursesByCategories = results[3];
  } catch (error) {
    // console.error("Error fetching dynamicTwo data", error);
  }
  // console.log(
  //   categoryDetails,
  //   "categoryDetails",
  //   coursesByCategories,
  //   "coursesByCategories"
  // );
  if (!specializationCategoriesAfterValidation && !coursesByCategories)
    return notFound();
  // Final rendering logic
  return (
    <>
      {specializationCategoriesAfterValidation ? (
        <Specialization
          data={specializationCategoriesAfterValidation}
          params={dynamicOne}
          paramsTwo={dynamicTwo}
          city={true}
          specialization={specialization}
        />
      ) : (
        <>
          <Category
            course={coursesByCategories}
            categoryDetail={categoryDetails}
            params={dynamicTwo}
            cityParams={dynamicOne}
          />
        </>
      )}
    </>
  );
}
