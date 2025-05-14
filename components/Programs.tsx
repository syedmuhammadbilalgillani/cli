"use client";
import {
  AR_DOMAIN_URL,
  EN_DOMAIN_URL,
  LOCALE_LANGUAGE,
} from "@/constant/apiUrl";
import axiosInstance from "@/utils/axios";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Filters from "./HeroFilter";
import HeroSection from "./HeroSection";
import CourseListing from "./ItemList";
import Loading from "./Loading";
import Pagination from "./Pagination";
import TrainingProgramDesc from "./TrainingProgramDesc";
import ShortMastersPrograms from "./ShortMastersPage";
import DiplomaProgramsPage from "./DiplomaDescription";

interface ProgramsProps {
  params: string;
  data: object | any;
  program: object | any;
}

interface QueryParams {
  search?: string;
  month?: string;
  year?: string;
  specialization?: string;
  category?: string;
  city?: string;
  page: string;
  per_page: number;
}

const Programs: React.FC<ProgramsProps> = ({ params, data, program }) => {
  const [courseData, setCourseData] = useState<any>(data ?? []);
  const [filteredCourses, setFilteredCourses] = useState<any>(data?.data ?? []);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const pathname = usePathname();
  const [filterValues, setFilterValues] = useState({
    searchInput: searchParams.get("search") || "",
    selectedMonth: searchParams.get("month") || "",
    selectedYear: searchParams.get("year") || "",
    selectedSpecialization: searchParams.get("specialization") || "",
    selectedCategory: searchParams.get("category") || "",
    selectedCity: searchParams.get("city") || "",
  });
  console.log(program, "program");
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
      search: filterValues.searchInput.trim() || undefined,
      month: filterValues.selectedMonth || undefined,
      year: filterValues.selectedYear || undefined,
      specialization: filterValues.selectedSpecialization || undefined,
      category: filterValues.selectedCategory || undefined,
      city: filterValues.selectedCity || undefined,
      page: pageToUse.toString(),
      per_page: 50,
    };

    // Update URL
    updateURL({
      search: filterValues.searchInput.trim(),
      month: filterValues.selectedMonth,
      year: filterValues.selectedYear,
      specialization: filterValues.selectedSpecialization,
      category: filterValues.selectedCategory,
      city: filterValues.selectedCity,
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
      const res = await axiosInstance.get<any>(
        `/courses?${queryParams}&program=${params}`
      );
      const fetchedCourses = res?.data?.data ?? [];

      // If no courses found on current page and page > 1, redirect to page 1
      if (fetchedCourses.length === 0 && pageToUse > 1) {
        setPage(1);
        updateURL({
          ...filterValues,
          page: "1",
        });
        handleSearch(1); // Re-trigger search with page 1
        return;
      }

      setFilteredCourses(fetchedCourses);
      setCourseData(res?.data);

      // Reset filters if clearing
      if (customPage === "clear") {
        setFilterValues({
          searchInput: "",
          selectedMonth: "",
          selectedYear: "",
          selectedSpecialization: "",
          selectedCategory: "",
          selectedCity: "",
        });
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
    if (
      searchParams.get("search") ||
      searchParams.get("month") ||
      searchParams.get("year") ||
      searchParams.get("specialization") ||
      searchParams.get("category") ||
      searchParams.get("city") ||
      searchParams.get("page")
    ) {
      handleSearch();
    }
  }, []);

  const [firstWord, ...remainingWords] = program?.metaTitle.split(" ");
  const firstPart = firstWord;
  const secondPart = remainingWords.join(" ");

  const mapDateToISO = (dateStr: string) => {
    // Expects format like "31-03-25" => converts to "2025-03-31"
    const [day, month, year] = dateStr.split("-");
    return `20${year}-${month}-${day}`;
  };

  const generateJsonLdData = (courses: any[], locale: string) => {
    const isArabic = locale === "ar";
    const DOMAIN_URL = isArabic ? AR_DOMAIN_URL : EN_DOMAIN_URL;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: (courses || []).map((course, index) => {
        const title = isArabic ? course?.title : course?.title;
        const summary = isArabic
          ? course?.meta_description
          : course?.meta_description;
        const cities = course?.available_cities
          ?.map((city: any) => city.name)
          .join(isArabic ? "، " : ", ");
        const courseUrl = `${DOMAIN_URL}/${course.specialization_slug}/${course.category_slug}/${course.slug}`;
        const validFrom = course?.available_dates?.[0]?.date
          ? mapDateToISO(course.available_dates[0].date)
          : "2025-01-01";

        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Course",
            name: title || (isArabic ? "دورة بدون اسم" : "Unnamed Course"),
            description:
              summary ||
              (isArabic ? "لا يوجد وصف." : "No description available."),
            url: courseUrl,
            provider: {
              "@type": "Organization",
              name: isArabic
                ? "معهد التاج للتدريب - لندن"
                : "London Crown Institute of Training",
              sameAs: `${DOMAIN_URL}/`,
            },
            image: {
              "@type": "ImageObject",
              url: course?.image || `${DOMAIN_URL}/default-course-image.webp`,
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: isArabic ? "حضوري" : "Onsite",
              courseWorkload: isArabic ? "٢٢ ساعة" : "PT22H",
              courseSchedule: {
                "@type": "Schedule",
                duration: "P1W",
                repeatCount: "1",
                repeatFrequency: isArabic ? "أسبوعيًا" : "Weekly",
              },
              location: {
                "@type": "Place",
                name:
                  cities || (isArabic ? "المدينة الافتراضية" : "Default City"),
              },
            },
            offers: {
              "@type": "Offer",
              category: isArabic ? "مدفوع" : "Paid",
              price: course?.price || "1200.00",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
              validFrom: validFrom,
            },
          },
        };
      }),
    };
  };
  const jsonLdData = generateJsonLdData(filteredCourses, LOCALE_LANGUAGE);
  // console.log(filteredCourses,'filteredCourses')
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <HeroSection
        contentClassName="md:bottom-10 bottom-0"
        parentClassName="md:h-[70dvh] h-[60dvh]"
        imageUrl="/image_consult.png"
        heading={firstPart}
        highlight={secondPart}
      >
        <Filters
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          onSearch={() => handleSearch(1)}
        />
      </HeroSection>
      <div className="mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          <CourseListing
            check_city_courses={false}
            filteredCourses={filteredCourses}
            params={params}
          />
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={courseData?.pagination?.total_pages || 1}
        onPageChange={(newPage) => {
          setPage(newPage); // your own state setter or handler
          handleSearch(newPage);
        }}
      />{" "}
      <main className="px-10">
        {pathname === "/training-courses" ||
        decodeURIComponent(pathname) === "/الدورات-التدريبية" ? (
          <TrainingProgramDesc />
        ) : pathname === "/masters" ||
          decodeURIComponent(pathname) === "/الماجستير" ? (
          <ShortMastersPrograms />
        ) : pathname === "/diploma" ||
          decodeURIComponent(pathname) === "/دبلوم" ? (
          <DiplomaProgramsPage />
        ) : null}
      </main>
    </>
  );
};

export default Programs;
