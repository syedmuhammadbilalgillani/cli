"use client";
import TranslatedText from "@/lang/TranslatedText";
import Link from "next/link";
import React, { useState } from "react";

// Define the types for props
interface Course {
  id: number;
  name: string;
  slug: string;
}

interface Specialization {
  id: number;
  name: string;
  slug: string;
  categories?: Course[]; // made categories optional
}

interface SpecializationSectionProps {
  data?: Specialization[]; // made data optional
}

const SpecializationSection: React.FC<SpecializationSectionProps> = ({
  data,
}) => {
  const [selectedSpec, setSelectedSpec] = useState<Specialization | null>(
    data?.length ? data[0] : null
  );



 
  return (
    <>
     
      <div className="container md:px-16 p-4 ">
        {/* Rest of component remains the same */}
        <div className="mb-6 ">
          <div className="flex md:flex-nowrap flex-wrap md:justify-start justify-center w-full gap-4  overflow-x-auto py-2 custom-scrollbar">
            {data?.length ? (
              data.map((spec) => (
                <h2
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec)}
                  className={`w-fit px-4 py-4 h-10 flex items-center justify-center text-center cursor-pointer rounded-lg text-base border transition-colors ${
                    selectedSpec?.id === spec.id
                      ? "bg-primary text-white border-blue-500"
                      : "bg-white text-primary border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {spec.name}
                </h2>
              ))
            ) : (
              <TranslatedText textKey="table.noData" />
            )}
          </div>
        </div>

        {/* Courses List for the Selected Specialization */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center md:px-20 border-[2px] py-6 rounded-lg">
            {selectedSpec?.categories?.length ? (
              selectedSpec?.categories?.map((course) => (
                <Link
                  key={course.id}
                  href={`/${selectedSpec?.slug}/${course?.slug}`}
                  className="mt-2 text-gray-700 text-sm font-light relative p-4 rounded-lg transition-all ease-in-out duration-300 hover:text-primary hover:shadow-lg"
                >
                  <h3 className="relative flex justify-center line-clamp-2">
                    <p className="mb-2 line-clamp-2 text-center w-64 pb-3 flex justify-center">
                      {course?.name}
                    </p>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transition-all duration-300"></div>
                  </h3>
                </Link>
              ))
            ) : (
              <div className="flex justify-center">
                <p className="flex justify-center text-center text-sm text-primary mx-auto w-screen">
                  <TranslatedText textKey="table.noData" />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecializationSection;
