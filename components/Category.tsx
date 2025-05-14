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
  const [filteredCourses, setFilteredCourses] = useState<any[]>(
    course?.data || []
  );
  const PER_PAGE = 50;
  console.log(categoryDetail, "categoryDetails");

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
  const jsonLdData =
    LOCALE_LANGUAGE === "ar"
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: (filteredCourses || []).map((course, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name: course?.arabic_title || "دورة بدون اسم",
              description: course?.arabic_summary || "لا يوجد وصف.",
              category: course?.arabic_category || "تدريب",
              url: `${AR_DOMAIN_URL}${
                cityParams !== "" && `/${cityParams}`
              }/${params}/${course?.slug || "default-course"}`,
              provider: {
                "@type": "Organization",
                name: "معهد التاج للتدريب - لندن",
                sameAs: "https://clinstitute.co.uk/",
              },
              image: {
                "@type": "ImageObject",
                url:
                  course?.image || "https://clinstitute.co.uk/Logocrown.webp",
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
                  name:
                    course?.available_cities?.length > 0
                      ? course.available_cities
                          .map((city: any) => city.arabic_name || city.name)
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
          itemListElement: (filteredCourses || []).map((course, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              name: course?.title || "Untitled Course",
              description: course?.summary || "No description available.",
              category: course?.category || "Training",
              url: `${EN_DOMAIN_URL}${
                cityParams !== "" && `/${cityParams}`
              }/${params}/${course?.slug || "default-course"}`,
              provider: {
                "@type": "Organization",
                name: "Crown Institute of Training - London",
                sameAs: "https://clinstitute.co.uk/",
              },
              image: {
                "@type": "ImageObject",
                url:
                  course?.image || "https://clinstitute.co.uk/Logocrown.webp",
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
                  name:
                    course?.available_cities?.length > 0
                      ? course.available_cities
                          .map((city: any) => city.name || city.arabic_name)
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
  const [firstWord, secondWord, ...remainingWords] =
    categoryDetail?.data?.name.split(" ");
  const firstPart = [firstWord, secondWord].filter(Boolean).join(" ");
  const secondPart = remainingWords.join(" ");
  // console.log(filteredCourses, "flter course");
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
        highlight={`${secondPart} ${
          LOCALE_LANGUAGE === "en" ? "In" : "في"
        } ${cityParams}`}
      />

      <div className="mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          <CourseListing
            check_city_courses={cityPath}
            filteredCourses={filteredCourses ?? []}
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

          <p
            className="mt-2 text-sm text-gray-600  line-clamp-3"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: categoryDetail?.data?.description ?? undefined,
            }}
          ></p>
        </div>
      )}

      <Blogs />
    </>
  );
};

export default Category;
