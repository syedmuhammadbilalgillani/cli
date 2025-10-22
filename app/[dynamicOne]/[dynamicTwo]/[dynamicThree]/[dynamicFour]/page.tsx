import Blogs from "@/components/Blogs";
import CourseDetal from "@/components/CourseDetail";
import HeroSection from "@/components/HeroSection";
import Loading from "@/components/Loading";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchCategoryBySlug } from "@/requests/categories/api";
import { fetchCityBySlug } from "@/requests/city/api";
import { fetchCourseDetails } from "@/requests/courses/api";
import { fetchSpecializationBySlug } from "@/requests/specializations/api";
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
    dynamicFour: string;
    dynamicThree: string;
  }>;
}): Promise<Metadata> {
  const { dynamicThree, dynamicOne, dynamicTwo, dynamicFour } = await params;

  const courseData = await fetchCourseDetails({ course_slug: dynamicFour });

  if (!courseData) {
    return LOCALE_LANGUAGE === "en"
      ? {
          title: "Page Not Found",
          description: "The requested page does not exist.",
        }
      : {
          title: "الصفحة غير موجودة",
          description: "الصفحة التي طلبتها غير موجودة.",
        };
  }

  return {
    title: `${courseData.data.meta_title || courseData.data.title} `,
    description:
      courseData.data.meta_description ||
      `Learn about ${courseData.data.title}`,
    keywords: courseData.data.meta_keywords || "courses, training, development",
    alternates: {
      canonical: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicThree}/${dynamicFour}`,
    },
    openGraph: {
      title: `${courseData.data.meta_title || courseData.data.title} `,
      description: courseData.data.meta_description,
      url: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicFour}/${dynamicThree}`,
      images: [
        {
          url: courseData.data.image || `${DOMAIN_URL}/Logocrown.webp`,
          width: 800,
          height: 600,
          alt: courseData.data.title || "Course Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${courseData.data.meta_title || courseData.data.title}`,
      description: courseData.data.meta_description,
      images: [courseData.data.image || `${DOMAIN_URL}/Logocrown.webp`],
    },
  };
}

export default async function DynamicFour({
  params,
}: {
  params: Promise<{
    dynamicOne: string;
    dynamicTwo: string;
    dynamicThree: string;
    dynamicFour: string;
  }>;
}) {
  const { dynamicThree, dynamicOne, dynamicTwo, dynamicFour } = await params;

  const isCategoryValid = await fetchCategoryBySlug({ slug: dynamicThree });
  const city = await fetchCityBySlug({ slug: dynamicOne });
  const isSpecializationValid = await fetchSpecializationBySlug({
    slug: dynamicTwo,
  });

  if (!isSpecializationValid || !city || !isCategoryValid) {
    return notFound();
  }
  const courseData = await fetchCourseDetails({ course_slug: dynamicFour });
  if (!courseData) return notFound();
  
  return (
    <div>
      <HeroSection
        imageUrl={courseData.data.image}
        heading={`${courseData.data.title} ${
          LOCALE_LANGUAGE === "en" ? "In" : "في"
        } ${
          courseData?.data?.available_cities?.find(
            (c: any) =>
              decodeURIComponent(c?.slug) === decodeURIComponent(dynamicOne)
          )?.name
        }`}
      />

      <Suspense fallback={<Loading />}>
        <CourseDetal course={courseData.data} params={dynamicFour} isCity />
      </Suspense>

      <Blogs />
    </div>
  );
}
