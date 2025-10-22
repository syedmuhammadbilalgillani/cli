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
import { formatTitleCase } from "@/utils/formatTitleCase";
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
    let title;

    // Check if data comes from categoryData
    if (categoryData?.data && data === categoryData.data) {
      title = `${data.meta_title} `;
    } else {
      title = `${data.meta_title}  ${`${
        LOCALE_LANGUAGE === "en"
          ? `in ${formatTitleCase(dynamicOne)}`
          : `في ${decodeURIComponent(dynamicOne)}`
      }`}`;
    }

    title = title || "London Crown Institute of Training";

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

  let specialization = null;
  let category = null;
  try {
    [category, specialization] = await Promise.all([
      fetchCategoryBySlug({ slug: dynamicTwo }),
      fetchSpecializationBySlug({ slug: dynamicTwo }),
    ]);
  } catch (error) {
    console.error("Error validating dynamicOne", error);
  }
  console.log(specialization, "specialization");
  // If none of the slugs from dynamicOne are valid, return NotFound
  if (!category && !specialization) {
    return notFound();
  }
  let specializationCategoriesAfterValidation = null;
  let coursesByCategories = null;

  if (category) {
    if (
      category?.data?.specialization_slug !== decodeURIComponent(dynamicOne)
    ) {
      return notFound();
    }
    coursesByCategories = await fetchCoursesByCategoryWithPagination({
      category_slug: dynamicTwo,
      per_page: (await searchParams).per_page ?? 50,
      page: (await searchParams).page ?? 1,
    });
    if (!coursesByCategories) {
      return notFound();
    }
  } else if (specialization) {
    const checkCity = await fetchCityBySlug({ slug: dynamicOne });
    if (!checkCity) {
      return notFound();
    }

    specializationCategoriesAfterValidation =
      await fetchCategoryBySpecialization({ slug: dynamicTwo });
    if (!specializationCategoriesAfterValidation) {
      return notFound();
    }
  }

  return (
    <>
      {specializationCategoriesAfterValidation ? (
        <Specialization
          data={specializationCategoriesAfterValidation}
          params={decodeURIComponent(dynamicOne)}
          paramsTwo={decodeURIComponent(dynamicTwo)}
          city={true}
          specialization={specialization}
          cityPath={true}
          cityParams={
            LOCALE_LANGUAGE === "en"
              ? dynamicOne
              : decodeURIComponent(dynamicOne)
          }
        />
      ) : (
        <>
          <Category
            course={coursesByCategories}
            categoryDetail={category}
            params={decodeURIComponent(dynamicTwo)}
            cityParams={decodeURIComponent(dynamicOne)}
          />
        </>
      )}
    </>
  );
}
