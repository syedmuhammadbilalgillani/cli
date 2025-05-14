"use client";

// import CityListing from "@/components/CityCourseList";
import Loading from "@/components/Loading";
import TranslatedText from "@/lang/TranslatedText";
import axiosInstance from "@/utils/axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import CityListing from "@/components/CityListing";
import { fetchCitiesWithPagination } from "@/requests/city/api";

const ITEMS_PER_PAGE = 50;

interface City {
  id: number;
  name: string;
  // Add other properties of a city as required
}

interface CityPageProps {
  data: {
    data: City[];
    pagination: {
      total_pages: number;
    };
  };
}

const CityPage = ({ data }: CityPageProps) => {
  const searchParams = useSearchParams();

  const [cities, setCities] = useState<City[]>(data?.data ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") ?? "1", 10)
  );
  const [totalPages, setTotalPages] = useState<number>(1);

  const updateURL = (params: Record<string, string>) => {
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

  const handleSearch = async (customPage = page) => {
    const query = {
      page: customPage,
      per_page: ITEMS_PER_PAGE,
    };

    updateURL({ page: customPage.toString() });

    try {
      setIsLoading(true);
      const responseData = await fetchCitiesWithPagination(query);

      if (responseData) {
        setCities(responseData.data ?? []);
        setTotalPages(responseData.pagination?.total_pages || 1);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(page);
  }, [page]);

  return (
    <>
      <HeroSection
        parentClassName="md:h-[70dvh] h-[50dvh]"
        imageUrl="/image_consult.png"
        imageAlt="city page banner"
        heading="city.courses_offered_by"
        localhighlight="city.location"
      />

      <div className="container p-4 mx-auto">
        <div className="flex justify-center">
          <div className="mt-6">
            {isLoading ? (
              <Loading />
            ) : cities.length > 0 ? (
              <>
                <CityListing cities={cities as any} />
              </>
            ) : (
              <TranslatedText
                as="p"
                className="text-primary"
                textKey={"table.noData"}
              />
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
          <motion.button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            whileHover={{ scale: page === 1 ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="text-lg" />
          </motion.button>

          {(() => {
            const visiblePages = [];
            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
            } else {
              visiblePages.push(1);
              if (page > 3) visiblePages.push("...");
              for (
                let i = Math.max(2, page - 1);
                i <= Math.min(totalPages - 1, page + 1);
                i++
              ) {
                visiblePages.push(i);
              }
              if (page < totalPages - 2) visiblePages.push("...");
              visiblePages.push(totalPages);
            }

            return visiblePages.map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2 text-primary">
                  ...
                </span>
              ) : (
                <motion.button
                  key={p}
                  onClick={() => setPage(p as any)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
                    p === page
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {p}
                </motion.button>
              )
            );
          })()}

          <motion.button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-base ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            whileHover={{ scale: page === totalPages ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="text-lg" />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default CityPage;
