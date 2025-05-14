"use client";

import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface City {
  slug: string;
  name: string;
  arabic_name?: string;
}

interface DateItem {
  date: string;
}

interface Course {
  slug: string;
  title: string;
  arabic_title?: string;
  summary?: string;
  arabic_summary?: string;
  content?: string;
  objectives?: string;
  image?: string;
  price?: string;
  category?: string;
  arabic_category?: string;
  available_dates: DateItem[];
  available_cities: City[];
}

interface Params {
  slug: string;
}

interface CourseDetalProps {
  course: Course;
  params: string;
}

const CourseDetal: React.FC<CourseDetalProps> = ({ course, params }) => {
  const cityCheck = (slug: string): string => {
    if (slug) {
      return course?.available_cities?.find((city) => city.slug === slug)
        ? slug
        : "";
    }
    return "";
  };

  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    course?.available_dates[0]?.date
  );
  const [selectedCity, setSelectedCity] = useState<string>(cityCheck(params));
  const [customDate, setCustomDate] = useState<string>("");

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
  };

  const getRegisterLink = (): string => {
    if (selectedDate || selectedCity) {
      return `/register?course=${course.slug}&date=${
        customDate || selectedDate
      }&city=${selectedCity}`;
    }
    return `/register?course=${course.slug}`;
  };

  function formatCityName(city: string | undefined): string {
    if (!city) return "Select a City";
    return city
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const jsonLdData =
    mounted && course
      ? LOCALE_LANGUAGE === "ar"
        ? {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course?.arabic_title || "دورة بدون اسم",
            description: course?.arabic_summary || "لا يوجد وصف.",
            educationalCredentialAwarded: course?.arabic_category || "الهندسة",
            provider: {
              "@type": "Organization",
              name: "معهد التاج للتدريب - لندن",
              sameAs: "https://ar.clinstitute.co.uk/",
            },
            image: {
              "@type": "ImageObject",
              url:
                course?.image ||
                "https://ar.clinstitute.co.uk/default-course-image.webp",
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
                startDate: course?.available_dates?.[0]?.date || "2025-01-01",
                endDate:
                  course?.available_dates?.[1]?.date ||
                  course?.available_dates?.[0]?.date ||
                  "2025-01-07",
              },
              location: {
                "@type": "Place",
                name:
                  course?.available_cities?.length > 0
                    ? course.available_cities.find(
                        (city) => city.slug === params
                      )?.arabic_name ||
                      course.available_cities
                        .map((city) => city.arabic_name || city.name)
                        .join("، ")
                    : "المدينة الافتراضية",
              },
            },
            offers: {
              "@type": "Offer",
              category: "مدفوع",
              price: course?.price || "3200.00",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
              validFrom: course?.available_dates?.[0]?.date || "2025-01-01",
            },
            review: {
              "@type": "Review",
              datePublished: new Date().toISOString(),
              dateModified: new Date().toISOString(),
              author: {
                "@type": "Person",
                name: "المسؤول",
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: "4.6",
              },
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "Course",
            name: course?.title || "Unnamed Course",
            description: course?.summary || "No description available.",
            educationalCredentialAwarded: course?.category || "Engineering",
            provider: {
              "@type": "Organization",
              name: "London Crown Institute of Training",
              sameAs: "https://clinstitute.co.uk/",
            },
            image: {
              "@type": "ImageObject",
              url:
                course?.image ||
                "https://clinstitute.co.uk/default-course-image.webp",
            },
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "Onsite",
              courseWorkload: "PT22H",
              courseSchedule: {
                "@type": "Schedule",
                duration: "P1W",
                repeatCount: "1",
                repeatFrequency: "Weekly",
                startDate: course?.available_dates?.[0]?.date || "2025-01-01",
                endDate:
                  course?.available_dates?.[1]?.date ||
                  course?.available_dates?.[0]?.date ||
                  "2025-01-07",
              },
              location: {
                "@type": "Place",
                name:
                  course?.available_cities?.length > 0
                    ? course.available_cities.find(
                        (city) => city.slug === params
                      )?.name ||
                      course.available_cities
                        .map((city) => city.name)
                        .join(", ")
                    : "Default City",
              },
            },
            offers: {
              "@type": "Offer",
              category: "Paid",
              price: course?.price || "3200.00",
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
              validFrom: course?.available_dates?.[0]?.date || "2025-01-01",
            },
            review: {
              "@type": "Review",
              datePublished: new Date().toISOString(),
              dateModified: new Date().toISOString(),
              author: {
                "@type": "Person",
                name: "Admin",
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: "4.6",
              },
            },
          }
      : null;
  // console.log(course, "course");
  return (
    <div suppressHydrationWarning>
      {mounted && jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      <div className="md:mx-10 mx-2">
        {/* Sticky Title and Register Button */}
        <div className="sticky md:hidden top-14 bg-white">
          <div className="flex justify-between mx-3 mt-6 items-center">
            <div className="text-lg md:hidden  text-gray-900 mt-1 font-medium ">
              {course.title}
            </div>
            <Link
              href={getRegisterLink()}
              className="bg-secondary text-white text-sm items-center flex justify-center px-4 h-10 mt-2  rounded-lg"
            >
              <TranslatedText textKey={"courseDetails.register"} />
            </Link>
          </div>
          <div className="h-[1px] bg-secondary w-full my-2" />
        </div>
        <div className="md:mx-10 mx-2 flex gap-10">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col gap-10 p-3">
              {/* Tables for Dates and Cities */}
              <div className="flex flex-col gap-6 mt-6 border-[2px] shadow-lg p-6 rounded-xl">
                {/* Dates Table */}
                <div>
                  <h2 className="text-xl font-bold text-primary mb-4">
                    <TranslatedText textKey={"courseDetails.availableDates"} />
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300   text-sm">
                      <tbody>
                        {course?.available_dates.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">
                              <div
                                className={`w-5 h-5 border-2 rounded-md cursor-pointer flex items-center justify-center ${
                                  selectedDate === item.date
                                    ? "bg-primary"
                                    : "bg-white"
                                }`}
                                onClick={() => handleDateChange(item.date)}
                              >
                                {selectedDate === item.date && (
                                  <span className="text-white text-sm font-bold">
                                    ✔
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 border-b text-primary">
                              {item.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Custom Date Selector */}
                <div className="mt-6">
                  <TranslatedText
                    as="h2"
                    className="text-xl font-bold text-primary mb-4"
                    textKey={"courseDetails.customDateSelection"}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <input
                        id="custom-date"
                        type="date"
                        className="block w-full text-primary px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        value={customDate}
                        onChange={handleCustomDateChange}
                      />
                    </div>
                    {customDate && (
                      <p className="text-sm text-secondary mt-2">
                        <TranslatedText
                          textKey={"courseDetails.selectedCustomDate"}
                        />
                        <strong>{customDate}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Cities Table */}
                <div className="mt-6">
                  <TranslatedText
                    textKey={"courseDetails.availableCities"}
                    className="text-xl font-bold text-primary mb-4"
                    as="h2"
                  />

                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300   text-sm">
                      <tbody>
                        {course?.available_cities.map((city, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">
                              <div
                                className={`w-5 h-5 border-2 rounded-md cursor-pointer flex items-center justify-center ${
                                  selectedCity === city.slug
                                    ? "bg-primary"
                                    : "bg-white"
                                }`}
                                onClick={() => handleCityChange(city.slug)}
                              >
                                {selectedCity === city.slug && (
                                  <span className="text-white text-sm font-bold">
                                    ✔
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2 border-b text-primary">
                              {city.name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Price Section Below Cities */}
                  <div className="mt-4">
                    {/* <TranslatedText
                          as="h3"
                          className="text-base my-6 font-bold text-primary mb-2"
                        /> */}

                    <p className="text-base text-primary">£ {course.price}</p>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex flex-col gap-3 summary mt-10">
                {/* <TranslatedText
                  textKey={"courseDetails.summary"}
                  as="h2"
                  className="py-2 text-2xl font-bold   text-primary"
                /> */}
                <div className="w-full h-[1px] bg-secondary" />
                {course?.summary && mounted && (
                  <div suppressHydrationWarning={true}>
                    <p
                      className="w-full py-2 text-base   text-black/60"
                      dangerouslySetInnerHTML={{
                        __html: course?.summary ?? "",
                      }}
                    ></p>
                  </div>
                )}
              </div>

              {/* Objectives Section */}
              <div className="">
                <TranslatedText
                  textKey={"courseDetails.objectivesAndTargetGroup"}
                  as="h2"
                  className="py-2 text-2xl font-bold   text-primary"
                />
                <div className="w-full h-[1px] bg-secondary" />

                <p
                  className="w-full py-2 text-base   text-black/60"
                  dangerouslySetInnerHTML={{ __html: course?.objectives ?? "" }}
                ></p>
              </div>

              {/* Content Section */}
              <div className="flex flex-col gap-3 content">
                <TranslatedText
                  textKey={"courseDetails.courseContent"}
                  as="h2"
                  className="py-2 text-2xl font-bold   text-primary"
                />
                <div className="w-full h-[1px] bg-secondary" />
                <p
                  className="w-full py-2 text-base   text-black/60"
                  dangerouslySetInnerHTML={{ __html: course?.content ?? "" }}
                ></p>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="md:sticky mt-9 md:text-base md:top-24 md:w-[350px] md:h-auto md:p-5 bg-white border border-gray-300 md:rounded-lg md:shadow-md transition-all md:duration-300">
              <h2 className="text-xl font-semibold text-gray-800">
                {course.title}
              </h2>

              {/* Language */}
              {/* <div className="mt-4 flex justify-between">
                <TranslatedText
                  textKey={"courseDetails.language"}
                  as="h3"
                  className="text-md font-medium text-primary"
                />
                <p className="text-sm text-gray-600">
                  {course.language || "English / Arabic"}
                </p>
              </div> */}

              {/* Certificate */}
              {/* <div className="mt-4 flex justify-between">
                <TranslatedText
                  textKey={"courseDetails.certificate"}
                  as="h3"
                  className="text-md font-medium text-primary"
                />
                <p className="text-sm text-gray-600">
                  {course.certificate ? (
                    <TranslatedText
                      ns="common"
                      textKey="courseDetails.certificateProvided"
                    />
                  ) : (
                    <TranslatedText
                      ns="common"
                      textKey="courseDetails.noCertificate"
                    />
                  )}
                </p>
              </div> */}

              {/* Date */}
              <div className="mt-4 flex justify-between">
                <TranslatedText
                  textKey={"courseDetails.date"}
                  as="h3"
                  className="text-md font-medium text-primary"
                />
                <p className="text-sm text-gray-600">
                  {selectedDate || customDate || "Select a Date"}
                </p>
              </div>

              {/* City */}
              <div className="mt-4 flex justify-between">
                <TranslatedText
                  textKey={"courseDetails.selectDate"}
                  as="h3"
                  className="text-md font-medium text-primary"
                />
                <p className="text-sm text-gray-600">
                  {formatCityName(selectedCity)}
                </p>
              </div>

              {/* Price */}
              <div className="mt-4 flex justify-between">
                <TranslatedText
                  textKey={"courseDetails.price"}
                  as="h3"
                  className="text-md font-medium text-primary"
                />
                <p className="text-lg font-semibold text-gray-900">
                  £ {course.price}
                </p>
              </div>

              {/* Register Button */}
              <Link
                href={getRegisterLink()}
                className="mt-5 block w-full bg-secondary hover:bg-primary-dark text-white text-center py-2 rounded-lg font-medium transition-all duration-300 shadow-md"
              >
                <TranslatedText
                  textKey={"courseDetails.registerNow"}
                  as="span"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetal;
