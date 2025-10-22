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
import TranslatedText from "@/lang/TranslatedText";
import { t } from "i18next";
import Link from "next/link";
import { useState } from "react";

interface Course {
  id: string;
  title: string;
  specialization_slug: string;
  category_slug: string;
  slug: string;
  price: number;
  available_dates: { id: string; date: string }[];
  available_cities: { id: string; name: string; slug: string }[];
}

interface CourseListingProps {
  filteredCourses?: any;
  params?: string;
  cities?: { id: string; name: string; slug: string }[];
  check_city_courses?: boolean;
  hideDropdown?: boolean;
}

const CourseListing: React.FC<CourseListingProps> = ({
  filteredCourses = [],
  params = "",
  cities = [],
  hideDropdown = false,
  check_city_courses = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { selectedDate?: string; selectedCity?: string };
  }>({});

  const handleSelectChange = (
    courseId: string,
    type: "selectedDate" | "selectedCity",
    value: string
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [type]: value,
      },
    }));
  };

  return (
    <>
      <Card className="w-full max-w-6xl mx-auto shadow-md rounded-lg">
        <CardContent className="p-6">
          {cities && cities.length > 0 ? (
            <div className="hidden md:block">
              <Table className="w-[300px] border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.cityTitle"
                      />
                    </TableHead>
                    <TableHead className="py-3 px-4 text-center text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.options"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((course) => (
                    <TableRow key={course?.id} className="hover:bg-gray-50">
                      <TableCell className="py-3 px-4 text-sm font-medium text-primary hover:text-secondary">
                        <Link href={`/${course?.slug}`}>
                          <h3>{course?.name}</h3>
                        </Link>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center">
                        <Link
                          href={`/${course?.slug}`}
                          className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary"
                        >
                          <TranslatedText
                            ns="common"
                            as="h3"
                            textKey="table.viewAllCourses"
                          />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="hidden md:block">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.courseTitle"
                      />
                    </TableHead>
                    <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.dates"
                      />
                    </TableHead>
                    {!hideDropdown && (
                      <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                        <TranslatedText
                          as="h2"
                          ns="common"
                          textKey="table.cities"
                        />
                      </TableHead>
                    )}
                    <TableHead className="py-3 px-4 text-left text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.price"
                      />
                    </TableHead>
                    <TableHead className="py-3 px-4 text-center text-sm font-semibold text-primary">
                      <TranslatedText
                        as="h2"
                        ns="common"
                        textKey="table.options"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <TranslatedText
                          as="h2"
                          ns="common"
                          textKey="table.noData"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course: any) => (
                      <TableRow key={course?.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 px-4 text-sm font-medium text-primary hover:text-secondary">
                          <Link
                            href={`${
                              check_city_courses
                                ? `/${params}/${course?.specialization_slug}/${course?.category_slug}/${course?.slug}`
                                : `/${course?.specialization_slug}/${course?.category_slug}/${course?.slug}`
                            }`}
                          >
                            <h3>{course?.title}</h3>
                          </Link>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <select
                            className="w-full border border-gray-300 rounded px-5 py-2 text-sm focus:ring-secondary focus:border-secondary"
                            value={
                              selectedOptions[course?.id]?.selectedDate || ""
                            }
                            onChange={(e) =>
                              handleSelectChange(
                                course?.id,
                                "selectedDate",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled>
                              {t("table.selectDate")}
                            </option>
                            {course?.available_dates.map((date: any) => (
                              <option key={date.id} value={date.date}>
                                {date.date}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        {!hideDropdown && (
                          <TableCell className="py-3 px-4">
                            <select
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-secondary focus:border-secondary"
                              value={
                                selectedOptions[course?.id]?.selectedCity || ""
                              }
                              onChange={(e) =>
                                handleSelectChange(
                                  course?.id,
                                  "selectedCity",
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                {t("table.selectCity")}
                              </option>
                              {course?.available_cities.map((city: any) => (
                                <option key={city.id} value={city.slug}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                        )}
                        <TableCell className="py-3 px-4 text-sm text-primary">
                          £ {course?.price}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-center">
                          <Link
                            href={`/register?course=${course?.slug}&date=${
                              selectedOptions[course?.id]?.selectedDate || ""
                            }&city=${
                              !hideDropdown
                                ? selectedOptions[course?.id]?.selectedCity ||
                                  ""
                                : params
                            }`}
                            className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary"
                          >
                            <TranslatedText
                              ns="common"
                              textKey="table.register"
                            />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Version with Date, City, Price, and Register Button */}
          <div className="space-y-4 md:hidden">
            {filteredCourses?.map((course: any) => (
              <Card
                key={course?.id}
                className="rounded-lg shadow-sm border border-gray-200"
              >
                <CardContent className="p-4 space-y-4">
                  <Link
                    href={`${
                      check_city_courses
                        ? `/${params}/${course?.specialization_slug}/${course?.category_slug}/${course?.slug}`
                        : `/${course?.specialization_slug}/${course?.category_slug}/${course?.slug}`
                    }`}
                    className="text-base font-semibold text-gray-800"
                  >
                    {course?.title}
                  </Link>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Date
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-secondary focus:border-secondary"
                        value={selectedOptions[course?.id]?.selectedDate || ""}
                        onChange={(e) =>
                          handleSelectChange(
                            course?.id,
                            "selectedDate",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          Select Date
                        </option>
                        {course?.available_dates.map((date: any) => (
                          <option key={date.id} value={date.date}>
                            {date.date}
                          </option>
                        ))}
                      </select>
                    </div>
                    {!hideDropdown && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select City
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-secondary focus:border-secondary"
                          value={
                            selectedOptions[course?.id]?.selectedCity || ""
                          }
                          onChange={(e) =>
                            handleSelectChange(
                              course?.id,
                              "selectedCity",
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Select City
                          </option>
                          {course?.available_cities.map((city: any) => (
                            <option key={city.id} value={city.slug}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-base font-semibold text-gray-800">
                      £ {course?.price}
                    </span>
                    <Link
                      href={`/register?course=${course?.slug}&date=${
                        selectedOptions[course?.id]?.selectedDate || ""
                      }&city=${
                        !hideDropdown
                          ? selectedOptions[course?.id]?.selectedCity || ""
                          : params
                      }`}
                      className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary"
                    >
                      <TranslatedText ns="common" textKey="table.register" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CourseListing;
