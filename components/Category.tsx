"use client";

import {
  AR_DOMAIN_URL,
  DOMAIN_URL,
  EN_DOMAIN_URL,
  LOCALE_LANGUAGE,
} from "@/constant/apiUrl";
import { fetchCategoryCourses } from "@/utils/apiFunctions";
import { formatSlug } from "@/utils/formatSlug";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Blogs from "./Blogs";
import HeroSection from "./HeroSection";
import CourseListing from "./ItemList";
import Notes from "./Notes";
import Pagination from "@/components/Pagination"; // Adjust the import path as needed
import {
  fetchCoursesByCategory,
  fetchCoursesByCategoryWithPagination,
} from "@/requests/courses/api";
import Loading from "./Loading";
import { formatTitleCase } from "@/utils/formatTitleCase";
import { TEXT } from "@/constant/text";

interface CategoryProps {
  course: any;
  categoryDetail: object | any;
  params: string;
  cityParams?: string;
  cityPath?: boolean;
  hideDropdown?: boolean;
}

const Category: React.FC<CategoryProps> = ({
  course,
  categoryDetail,
  params,
  cityParams,
  cityPath = false,
  hideDropdown = false,
}) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [coursedata, setCourseData] = useState<any>(course ?? { data: [] });
  const [filteredCourses, setFilteredCourses] = useState(course?.data || []);
  const PER_PAGE = 50;
  // console.log(categoryDetail, "categoryDetails");

  // Update URL without triggering API calls
  const updateURL = (params: Record<string, string>): void => {
    const urlSearchParams = new URLSearchParams();

    // Add all non-empty params to URL
    Object.entries(params).forEach(([key, value]) => {
      // Skip adding page=1 to URL params
      if (key === "page" && value === "1") {
        return;
      }

      if (value !== "" && value !== undefined && value !== null) {
        urlSearchParams.set(key, value);
      }
    });

    // Build the new URL
    const newUrl = `${window.location.pathname}${
      urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : ""
    }`;

    // Update browser URL without triggering a page reload
    window.history.pushState({}, "", newUrl);
  };

  // Handle search parameters and API call
  const handleSearch = async (customPage?: number | "clear"): Promise<void> => {
    const pageToUse =
      customPage !== undefined && customPage !== "clear" ? customPage : page;

    const query: any = {
      page: pageToUse.toString(),
      per_page: PER_PAGE,
    };
    console.log(pageToUse);
    // Update URL with current search parameters
    updateURL({
      page: pageToUse.toString(),
    });

    // const queryParams = new URLSearchParams(
    //   Object.entries(query).reduce<Record<string, string>>(
    //     (acc, [key, value]) => {
    //       if (value !== undefined) acc[key] = value;
    //       return acc;
    //     },
    //     {}
    //   )
    // ).toString();

    try {
      setIsLoading(true);
      const res = await fetchCoursesByCategoryWithPagination({
        category_slug: params,
        page: page,
        per_page: PER_PAGE,
      });
      console.log(res, "res");
      setFilteredCourses(res?.data ?? []);
      setCourseData(res);

      // Only reset filters when explicitly clearing them
      if (customPage === "clear") {
        setPage(1);
        // Update URL to remove all params
        updateURL({ page: "1" });
      }
    } catch (error) {
      console.error("Error fetching filtered courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data from URL params on component mount
  useEffect(() => {
    // If we have any search params in the URL, trigger a search
    if (searchParams.get("page")) {
      handleSearch();
    }
  }, []);
  // console.log(filteredCourses, "filteredCourses");
  const courses = cityPath
    ? filteredCourses?.filter((data: any) =>
        data?.available_cities.some((city: any) => city?.slug === cityParams)
      )
    : filteredCourses;
  // console.log(courses, "courses");

  const jsonLdData =
    LOCALE_LANGUAGE === "ar"
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: (courses || []).map((course: any, index: any) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name:
                `${course?.title}${
                  cityPath
                    ? ` ${
                        LOCALE_LANGUAGE === "ar"
                          ? `في ${cityParams}`
                          : `in ${formatTitleCase(cityParams)}`
                      }`
                    : ""
                }` || "دورة بدون اسم",
              description: course?.meta_description || "لا يوجد وصف.",
              category: course?.category || "تدريب",
              url: cityPath
                ? `${DOMAIN_URL}${cityParams !== "" && `/${cityParams}`}/${
                    course?.specialization_slug
                  }/${course?.category_slug}`
                : `${DOMAIN_URL}/${course?.specialization_slug}/${course?.category_slug}`,
              provider: {
                "@type": "Organization",
                name: TEXT.INSTITUTE_NAME,
                sameAs: `${AR_DOMAIN_URL}`,
              },
              image: {
                "@type": "ImageObject",
                url: course?.image || `${AR_DOMAIN_URL}Logocrown.webp`,
              },
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "حضوري",
                courseWorkload: "٢٢ ساعة",
                courseSchedule: {
                  "@type": "Schedule",
                  duration: "أسبوع",
                  repeatCount: "1",
                  repeatFrequency: "أسبوعيًا",
                },
                location: {
                  "@type": "Place",
                  name: cityPath
                    ? cityParams
                    : course?.available_cities?.length > 0
                    ? course.available_cities
                        .map((city: any) => city.name || city.name)
                        .join("، ")
                    : "المدينة الافتراضية",
                },
              },
              offers: {
                "@type": "Offer",
                category: "مدفوع",
                price: course?.price || "3000",
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                validFrom: course?.available_dates?.[0]?.date || "2025-01-01",
              },
            },
          })),
        }
      : {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: (courses || []).map((course: any, index: any) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name:
                `${course?.title}${
                  cityPath
                    ? ` ${
                        LOCALE_LANGUAGE === "en"
                          ? `in ${formatTitleCase(cityParams)}`
                          : `في ${cityParams}`
                      }`
                    : ""
                }` || "Untitled Course",

              description:
                course?.meta_description || "No description available.",
              category: course?.category || "Training",
              url: cityPath
                ? `${DOMAIN_URL}${cityParams !== "" && `/${cityParams}`}/${
                    course?.specialization_slug
                  }/${course?.category_slug}`
                : `${DOMAIN_URL}/${course?.specialization_slug}/${course?.category_slug}`,
              provider: {
                "@type": "Organization",
                name: TEXT.INSTITUTE_NAME,
                sameAs: `${DOMAIN_URL}`,
              },
              image: {
                "@type": "ImageObject",
                url: course?.image || `${DOMAIN_URL}Logocrown.webp`,
              },
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "In-person",
                courseWorkload: "22 hours",
                courseSchedule: {
                  "@type": "Schedule",
                  duration: "1 week",
                  repeatCount: "1",
                  repeatFrequency: "Weekly",
                },
                location: {
                  "@type": "Place",
                  name: cityPath
                    ? cityParams
                    : course?.available_cities?.length > 0
                    ? course.available_cities
                        .map((city: any) => city.name || city.name)
                        .join(", ")
                    : "Default City",
                },
              },
              offers: {
                "@type": "Offer",
                category: "Paid",
                price: course?.price || "3000",
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                validFrom: course?.available_dates?.[0]?.date || "2025-01-01",
              },
            },
          })),
        };
  let firstPart = "";
  let secondPart = "";

  if (categoryDetail?.data?.name) {
    const [firstWord, secondWord, ...remainingWords] =
      categoryDetail?.data?.name?.split(" ");
    firstPart = [firstWord, secondWord].filter(Boolean).join(" ");
    secondPart = remainingWords.join(" ");
  }
  // console.log(filteredCourses, "flter course");
  const cityName =
    LOCALE_LANGUAGE === "en"
      ? `in ${formatTitleCase(cityParams)}`
      : `في ${cityParams}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <HeroSection
        parentClassName="md:h-[70dvh] h-[60dvh]"
        imageUrl="/image_consult.png"
        contentClassName="px-5 bottom-[5%]"
        heading={firstPart}
        localhighlight={`${secondPart} ${cityPath ? cityName : ""}`}
      />

      <div className="mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          <CourseListing
            check_city_courses={cityPath}
            filteredCourses={courses ?? []}
            params={cityParams}
            hideDropdown={hideDropdown}
          />
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={coursedata?.pagination?.total_pages || 1}
        onPageChange={(newPage) => {
          setPage(newPage);
          handleSearch(newPage);
        }}
      />
      {categoryDetail?.data?.description && (
        <div className="flex flex-col gap-3 mb-4 w-full max-w-6xl mx-auto px-10">
          <h2 className="mt-2 text-xl  font-semibold text-primary ">
            {categoryDetail?.data?.name}
          </h2>

          <div
            className="mt-2"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: categoryDetail?.data?.description ?? undefined,
            }}
          ></div>
        </div>
      )}

      <Blogs />
    </>
  );
};

export default Category;
