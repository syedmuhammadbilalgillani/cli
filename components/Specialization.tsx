"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchCategoryBySpecialization } from "@/requests/categories/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Blogs from "./Blogs";
import HeroSection from "./HeroSection";
import Loading from "./Loading";
import Pagination from "./Pagination";
import SectionTitle from "./SectionTitle";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { formatTitleCase } from "@/utils/formatTitleCase";

// Interfaces
interface City {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  number_of_courses: number;
}

interface AvailableDate {
  date: string;
}

interface Course {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  number_of_courses: number;
}

interface Pagination {
  total_pages: number;
}

interface CourseData {
  data: Course[];
  pagination: Pagination;
}

interface SpecializationProps {
  params: string;
  data: CourseData;
  specialization: any;
  city?: boolean;
  paramsTwo?: string;
  cityPath?: boolean;
  cityParams?: string;
}

interface CategoryListingProps {
  categories: Course[];
  params: string;
  city?: boolean;
  paramsTwo?: string;
}

const Specialization: React.FC<SpecializationProps> = ({
  params,
  data,
  specialization,
  city,
  paramsTwo,
  cityPath = false,
  cityParams,
}) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  console.log(specialization, "specialization");
  const [coursedata, setCourseData] = useState<CourseData>(
    data ?? { data: [] }
  );
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(
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
      const res = await fetchCategoryBySpecialization({
        slug: params,
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

  const cityName =
    cityPath && LOCALE_LANGUAGE === "en"
      ? `in ${formatTitleCase(cityParams)}`
      : `في ${cityParams}`;
  // if (data?.data?.length === 0) return <div>Not Found</div>;

  const [firstWord, secondWord, ...remainingWords] =
    specialization?.data?.name.split(" ");
  const firstPart = [firstWord, secondWord].filter(Boolean).join(" ");
  const secondPart = remainingWords.join(" ");

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      /> */}

      <HeroSection
        parentClassName="md:h-[70dvh] h-[60dvh]"
        contentClassName="px-5 bottom-[5%]"
        imageUrl={"/image_consult.png"}
        heading={firstPart ?? ""}
        localhighlight={`${secondPart ?? ""} ${cityPath ? cityName : ""}`}
      />

      <div className="mt-6">
        <SectionTitle
          title={`${specialization?.data?.name}`}
          highlight={`specialization.category_list`}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <CategoryListing
            city={city}
            categories={filteredCourses}
            params={params}
            paramsTwo={paramsTwo}
          />
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={coursedata?.pagination?.total_pages || 1}
        onPageChange={(newPage) => {
          setPage(newPage); // your own state setter or handler
          handleSearch(newPage);
        }}
      />
      {specialization?.data?.description && (
        <div className="flex flex-col gap-3 mb-4 w-full max-w-6xl mx-auto px-10 ">
          <h2 className="mt-2 text-xl  font-semibold text-primary ">
            {specialization?.data?.name}
          </h2>

          <div
            className="mt-2"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: specialization?.data?.description ?? undefined,
            }}
          ></div>
        </div>
      )}

      <Blogs />
    </>
  );
};

export const CategoryListing: React.FC<CategoryListingProps> = ({
  categories,
  params,
  paramsTwo,
  city,
}) => {
  console.log(categories, "categories");
  if (categories?.length === 0) return <div>Not Found</div>;
  return (
    <Card className="w-full max-w-6xl mx-auto shadow-md rounded-lg">
      <CardContent className="p-6">
        <div className="block">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                  Category
                </TableHead>
                <TableHead className="py-3 px-4 text-center text-sm font-semibold text-primary">
                  Options
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50">
                  <TableCell className="py-3 md:px-4 px-2 text-sm font-medium text-primary hover:text-secondary">
                    <Link
                      href={
                        city
                          ? `/${params}/${paramsTwo}/${course?.slug}`
                          : `/${params}/${course?.slug}`
                      }
                    >
                      {course?.name ?? "N/A"}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 md:px-4 px-0 text-center">
                    <Link
                      href={
                        city
                          ? `/${params}/${paramsTwo}/${course?.slug}`
                          : `/${params}/${course?.slug}`
                      }
                      className="md:px-4 px-2 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary"
                    >
                      View Courses
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Specialization;
