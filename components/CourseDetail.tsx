"use client";

import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useParams } from "next/navigation";
import { generateCourseDetailCrumbsJsonLdData } from "@/constant/schema";

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
  isCity: boolean;
}

const CourseDetal: React.FC<CourseDetalProps> = ({
  course,
  params,
  isCity = false,
}) => {
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCityOpen, setIsCityOpen] = React.useState(false);
  const { dynamicOne } = useParams();
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
  const jsonLdData = generateCourseDetailCrumbsJsonLdData({
    course: course,
    cityPath: isCity,
    cityParams: decodeURIComponent(dynamicOne as string) ,
  });

  return (
    <div suppressHydrationWarning>
      {mounted &&
        jsonLdData &&
        Object.values(jsonLdData).map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

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
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="flex flex-col gap-2"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 px-4">
                    <h2 className="text-xl font-bold text-primary mb-4">
                      <TranslatedText textKey="courseDetails.availableDates" />
                    </h2>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <ChevronsUpDown />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Always visible first item */}
                  <div className="px-4 py-2 font-mono text-sm w-full">
                    {course?.available_dates.slice(0, 1).map((item, index) => (
                      <div
                        key={index}
                        className="hover:bg-gray-50 grid grid-cols-3 border-b w-full"
                      >
                        <div className="px-4 py-2">
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
                        </div>
                        <div className="px-4 py-2 text-primary col-span-2">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Collapsible additional items */}
                  <CollapsibleContent className="flex flex-col gap-0 px-4 font-mono text-sm w-full">
                    {course?.available_dates.slice(1).map((item, index) => (
                      <div
                        key={index}
                        className="hover:bg-gray-50 grid grid-cols-3 border-b w-full"
                      >
                        <div className="px-4 py-2">
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
                        </div>
                        <div className="px-4 py-2 text-primary col-span-2">
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Custom Date Selector */}
                <section className="mt-6">
                  <TranslatedText
                    as="h2"
                    className="text-xl font-bold text-primary mb-4"
                    textKey="courseDetails.customDateSelection"
                  />
                  <div className="flex flex-col gap-4">
                    <input
                      id="custom-date"
                      type="date"
                      className="block w-full text-primary px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      value={customDate}
                      onChange={handleCustomDateChange}
                    />
                    {customDate && (
                      <p className="text-sm text-secondary mt-2">
                        <TranslatedText textKey="courseDetails.selectedCustomDate" />{" "}
                        <strong>{customDate}</strong>
                      </p>
                    )}
                  </div>
                </section>

                {/* Cities Table */}
                <Collapsible
                  open={isCityOpen}
                  onOpenChange={setIsCityOpen}
                  className="flex flex-col gap-2 mt-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 px-4">
                    <h2 className="text-xl font-bold text-primary mb-4">
                      <TranslatedText textKey="courseDetails.availableCities" />
                    </h2>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <ChevronsUpDown />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Always visible first city */}
                  {course?.available_cities.slice(0, 1).map((city, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-50 border-b grid grid-cols-3"
                    >
                      <div className="px-4 py-2">
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
                      </div>
                      <div className="px-4 py-2 text-primary">{city.name}</div>
                    </div>
                  ))}

                  {/* Collapsible Content for remaining cities */}
                  <CollapsibleContent className="overflow-x-auto">
                    {course?.available_cities.slice(1).map((city, index) => (
                      <div
                        key={index}
                        className="hover:bg-gray-50 border-b grid grid-cols-3"
                      >
                        <div className="px-4 py-2">
                          <div
                            className={`w-5 h-5 border-2 rounded-md cursor-pointer flex items-center justify-center ${
                              selectedCity === city.slug
                                ? "bg-primary"
                                : "bg-white"
                            }`}
                            onClick={() => handleCityChange(city.slug)}
                          >
                            {selectedCity === city?.slug && (
                              <span className="text-white text-sm font-bold">
                                ✔
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="px-4 py-2 text-primary">
                          {city.name}
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
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
                  {selectedCity === ""
                    ? isCity
                      ? course?.available_cities?.find(
                          (c: any) =>
                            decodeURIComponent(c?.slug) ===
                            decodeURIComponent(dynamicOne as any)
                        )?.name
                      : course?.available_cities[0].name
                    : course?.available_cities?.find(
                        (c: any) =>
                          decodeURIComponent(c?.slug) ===
                          decodeURIComponent(selectedCity)
                      )?.name}
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
