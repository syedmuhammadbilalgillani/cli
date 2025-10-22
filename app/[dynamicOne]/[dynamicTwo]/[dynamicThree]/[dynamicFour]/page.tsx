import Blogs from "@/components/Blogs";
import CourseDetal from "@/components/CourseDetail";
import HeroSection from "@/components/HeroSection";
import Loading from "@/components/Loading";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchCourseDetails } from "@/requests/courses/api";
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
    dynamicFour: string;
    dynamicThree: string;
  }>;
}): Promise<Metadata> {
  const { dynamicThree, dynamicOne, dynamicTwo, dynamicFour } = await params;

  const courseData = await fetchCourseDetails({ course_slug: dynamicFour });
  const data =
    !courseData ||
    courseData?.data?.category_slug !== decodeURIComponent(dynamicThree) ||
    courseData?.data?.specialization_slug !== decodeURIComponent(dynamicTwo) ||
    !courseData?.data?.available_cities?.some(
      (city: any) => city.slug === decodeURIComponent(dynamicOne)
    );
  if (data) {
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
    title: `${courseData.data.meta_title || courseData.data.title}  ${`${
      LOCALE_LANGUAGE === "en"
        ? `in ${formatTitleCase(dynamicOne)}`
        : `في ${decodeURIComponent(dynamicOne)}`
    }`} `,
    description:
      courseData.data.meta_description ||
      `Learn about ${courseData.data.title}`,
    keywords: courseData.data.meta_keywords || "courses, training, development",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: undefined,
      // canonical: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicThree}/${dynamicFour}`,
    },
    openGraph: {
      title: `${courseData.data.meta_title || courseData.data.title} `,
      description: courseData.data.meta_description,
      url: `${DOMAIN_URL}/${dynamicOne}/${dynamicTwo}/${dynamicThree}/${dynamicFour}`,
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

  const courseData = await fetchCourseDetails({
    course_slug: decodeURIComponent(dynamicFour),
  });
  if (
    !courseData ||
    courseData?.data?.category_slug !== decodeURIComponent(dynamicThree) ||
    courseData?.data?.specialization_slug !== decodeURIComponent(dynamicTwo) ||
    !courseData?.data?.available_cities?.some(
      (city: any) => city.slug === decodeURIComponent(dynamicOne)
    )
  )
    return notFound();
  console.log(courseData, "courseData");
  const cityName =
    LOCALE_LANGUAGE === "en"
      ? formatTitleCase(dynamicOne)
      : decodeURIComponent(dynamicOne);
  return (
    <div>
      <HeroSection
        imageUrl={courseData.data.image}
        heading={`${courseData.data.title} ${
          LOCALE_LANGUAGE === "en" ? "in" : "في"
        } ${cityName}`}
      />

      <Suspense fallback={<Loading />}>
        <CourseDetal
          course={courseData?.data}
          params={dynamicThree}
          isCity={false}
        />
      </Suspense>

      <Blogs />
    </div>
  );
}
