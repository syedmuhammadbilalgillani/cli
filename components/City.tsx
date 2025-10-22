"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { LOCALE_LANGUAGE } from "@/constant/apiUrl";

import { fetchCoursesByCityWithPagination } from "@/requests/courses/api";
import { formatTitleCase } from "@/utils/formatTitleCase";
import CourseListing from "./ItemList";
import Loading from "./Loading";
import Pagination from "./Pagination";
import { Card, CardContent } from "./ui/card";

const HeroSection = dynamic(() => import("./HeroSection"));

interface Category {
  slug: string;
  image?: string;
  name: string;
  specialization_slug: string;
}

interface CityCourse {
  arabic_name?: string;
  name?: string;
  arabic_description?: string;
  description?: string;
  specialization_slug: string;
  slug: string;
  image?: string;
  price?: string;
  available_dates?: { date: string }[];
}

interface Pagination {
  total_pages: number;
}

interface CourseData {
  data: CityCourse[];
  pagination?: Pagination;
}

interface CityProps {
  city?: any;
  data: object | any;
  params?: string;
  category?: {
    data: Category[];
  };
  check_city_courses: boolean;
  hideDropdown?: boolean;
}
interface QueryParams {
  page: string;
  per_page: number;
}

const City: React.FC<CityProps> = ({
  params,
  data,
  city,
  category,
  check_city_courses,
  hideDropdown = false,
}) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  console.log(city, "city");
  const [coursedata, setCourseData] = useState<CourseData>(
    data ?? { data: [] }
  );
  const [filteredCourses, setFilteredCourses] = useState<any[]>(
    data?.data || []
  );
  const PER_PAGE = 50;

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

    const query: QueryParams = {
      page: pageToUse.toString(),
      per_page: PER_PAGE,
    };

    // Update URL with current page
    updateURL({
      page: pageToUse.toString(),
    });

    const queryParams = new URLSearchParams(
      Object.entries(query).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        },
        {}
      )
    ).toString();

    try {
      setIsLoading(true);
      console.log(`/courses?${queryParams}&program=${params}`, "query");

      const res = await fetchCoursesByCityWithPagination({
        city_slug: String(params),
        page: pageToUse,
        per_page: PER_PAGE,
      });

      const fetchedCourses = res?.data ?? [];

      // Redirect to page 1 if no results on higher page
      if (fetchedCourses.length === 0 && pageToUse > 1) {
        setPage(1);
        updateURL({ page: "1" });
        handleSearch(1); // Re-fetch for page 1
        return;
      }

      setFilteredCourses(fetchedCourses);
      setCourseData(res);

      // Reset filters if explicitly clearing
      if (customPage === "clear") {
        setPage(1);
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
  const generateJsonLd = (isArabic = false) => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: (filteredCourses || []).map((course, index) => {
        const startDate = course.available_dates?.[0]?.date
          ? `20${course.available_dates[0].date.split("-").reverse().join("-")}`
          : "2025-01-01";
        const cities = course?.available_cities
          ?.map((city: any) => city.name)
          .join(isArabic ? "، " : ", ");
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Course",
            name:
              `${course?.title}${
                check_city_courses
                  ? ` ${
                      LOCALE_LANGUAGE === "ar"
                        ? `في ${decodeURIComponent(params??"")}`
                        : `in ${formatTitleCase(params)}`
                    }`
                  : ""
              }` || "",
            description: isArabic
              ? course.meta_description
              : course.meta_description || "No description available.",
            url: `https://${isArabic ? "ar." : ""}clinstitute.co.uk/${params}/${
              course.specialization_slug
            }/${
              course.category_slug
            }/${course.slug}`,
            image: {
              "@type": "ImageObject",
              url:
                course.image ||
                `https://${
                  isArabic ? "ar." : ""
                }clinstitute.co.uk/Logocrown.webp`,
            },
            provider: {
              "@type": "Organization",
              name: isArabic
                ? "معهد التاج للتدريب - لندن"
                : "London Crown Institute of Training",
              sameAs: `https://${isArabic ? "ar." : ""}clinstitute.co.uk/`,
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: isArabic ? "حضوري" : "Onsite",
              courseWorkload: isArabic ? "٢٢ ساعة" : "P22H",
              startDate: startDate,
              location: {
                "@type": "Place",
                name:
                  params ||
                  (isArabic ? "موقع غير محدد" : "Unspecified location"),
              },
              offers: {
                "@type": "Offer",
                price: course.price || "3000",
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                validFrom: startDate,
                category: course.category || (isArabic ? "مدفوع" : "Paid"),
              },
            },
          },
        };
      }),
    };
  };

  const jsonLdData =
    LOCALE_LANGUAGE === "ar" ? generateJsonLd(true) : generateJsonLd(false);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <HeroSection
        imageUrl={`${city?.data?.image}`}
        heading="city.training_courses_in"
        highlight={city?.data?.name}
        parentClassName="md:h-[70dvh] h-[60dvh]"
      />
      <div className="max-w-6xl mx-auto w-full px-4 md:mt-0 mt-[20%]">
        <div className="flex flex-wrap justify-center gap-5">
          {category?.data?.map((cat: any, index: number) => (
            <Link
              key={index}
              href={`/${params}/${cat.specialization_slug}/${cat.slug}`}
              className="w-full sm:max-w-[15rem] transition-transform duration-300 hover:scale-105"
            >
              <Card className="overflow-hidden p-0">
                <Image
                  src={cat?.image || "/placeholder.jpg"}
                  width={400}
                  height={400}
                  className="object-cover object-top h-36 w-full"
                  alt={cat?.name || `Category ${index + 1}`}
                  priority
                />
                <CardContent className="p-2 text-center bg-white">
                  <h3 className="text-base font-semibold text-gray-800">
                    {cat?.name || "N/A"}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          <CourseListing
            check_city_courses={check_city_courses}
            filteredCourses={filteredCourses}
            // cities_={cities}
            hideDropdown={hideDropdown}
            params={params}
          />
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={coursedata?.pagination?.total_pages || 1}
        onPageChange={(newPage) => {
          //   console.log(newPage, "new page");
          setPage(newPage);
          handleSearch(newPage);
        }}
      />
      {city?.data?.description && (
        <div className="flex flex-col gap-3 mb-4 w-full max-w-6xl mx-auto px-10">
          <h2 className="mt-2 text-xl  font-semibold text-primary">
            {city?.data?.name}
          </h2>

          <p
            className="mt-2"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: city?.data?.description ?? undefined,
            }}
          ></p>
        </div>
      )}
    </>
  );
};

export default City;
