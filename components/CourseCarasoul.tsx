"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import useMeasure from "react-use-measure";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import Head from "next/head";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { usePathname } from "next/navigation";

// Types
interface Course {
  id: string;
  title: string;
  image: string;
  price: number;
  slug: string;
  specialization_slug: string;
  category_slug: string;
  available_dates: { id: string; date: string }[];
  available_cities: { name: string; slug: string }[];
}

interface CourseCarouselProps {
  courses: Course[];
}

const CARD_WIDTH = 320;
const MARGIN = 20;
const CARD_SIZE = CARD_WIDTH + MARGIN;
const CARDS_PER_DOT = 1;

const CourseCarousel = ({ courses }: CourseCarouselProps) => {
  const [ref, { width }] = useMeasure();
  const [offset, setOffset] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pathname = usePathname();
  const totalDots = Math.ceil(courses?.length / CARDS_PER_DOT);

  const shiftLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setOffset((prev) => prev + CARD_SIZE * CARDS_PER_DOT);
    }
  };

  const shiftRight = () => {
    if (currentIndex < totalDots - 1) {
      setCurrentIndex((prev) => prev + 1);
      setOffset((prev) => prev - CARD_SIZE * CARDS_PER_DOT);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: shiftRight,
    onSwipedRight: shiftLeft,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const canonicalBase =
    typeof window !== "undefined" ? window.location.origin : DOMAIN_URL;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      LOCALE_LANGUAGE === "ar" ? "قائمة الدورات التدريبية" : "List of Courses",
    description:
      LOCALE_LANGUAGE === "ar"
        ? "استعرض مجموعة من الدورات المتاحة في تخصصات متعددة."
        : "Browse a selection of available courses in various specializations.",
    url: `${canonicalBase}${pathname}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalBase}${pathname}`,
    },
    itemListElement: courses?.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: course.title,
      url: `${canonicalBase}/${course.available_cities[0]?.slug}/${course.specialization_slug}/${course.category_slug}/${course.slug}`,
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <section className="pb-8" {...handlers}>
        <div className="relative overflow-hidden p-4">
          <div className="mx-auto">
            <motion.div
              animate={{ x: offset }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              className="flex gap-5 md:gap-0 md:pl-4"
            >
              {courses?.slice(0, 6).map((course, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: CARD_WIDTH }}
                >
                  <div
                    className="bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 w-[300px] md:w-[280px] flex flex-col items-center relative"
                    style={{
                      outline: "3px solid white",
                      boxShadow: "0 0 0 3px #E5C17C",
                    }}
                  >
                    {/* Course Image */}
                    <div className="w-full h-[150px] rounded-md overflow-hidden">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={200}
                        height={180}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-center line-clamp-2 text-base font-semibold mt-3">
                      {course.title}
                    </h3>

                    {/* Course Details */}
                    <div className="mt-3 w-full">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        {course.available_dates.slice(0, 2).map((date) => (
                          <div key={date.id} className="flex items-center">
                            <Calendar className="text-primary mr-2 h-4 w-4" />
                            {date.date}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-700 font-medium">
                        {course.available_cities.length > 0 && (
                          <div className="flex items-center">
                            <MapPin className="text-primary mr-2 h-4 w-4" />
                            {course.available_cities[0].name}
                          </div>
                        )}
                        <span className="text-primary text-lg font-semibold">
                          £ {course.price}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between w-full">
                      <Link
                        href={`/${course.specialization_slug}/${course.category_slug}/${course.slug}`}
                        className="bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-secondary transition"
                      >
                        Details
                      </Link>
                      <Link
                        href={`/register?course=${course.slug}`}
                        className="bg-secondary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary transition"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-start ml-10 w-full items-center pt-5">
          <div className="flex items-center gap-4">
            <button
              className={`rounded-lg border-[1px] bg-primary p-2 text-2xl transition-opacity ${
                currentIndex > 0 ? "" : "opacity-30"
              }`}
              onClick={shiftLeft}
            >
              <ArrowLeft className="text-white" />
            </button>
            <button
              className={`rounded-lg border-[1px] bg-primary p-2 text-2xl transition-opacity ${
                currentIndex < totalDots - 1 ? "" : "opacity-30"
              }`}
              onClick={shiftRight}
            >
              <ArrowRight className="text-white" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseCarousel;
