import Carousal from "@/components/Carousal";
import CourseCarousel from "@/components/CourseCarasoul";
import Design from "@/components/Design";
import Loading from "@/components/Loading";
import MobileFilter from "@/components/MobileFilter";
import RequestCourse from "@/components/RequestCourse";
import SectionTitle from "@/components/SectionTitle";
import SpecializationSection from "@/components/SpecializationSection";
import Testimonials from "@/components/Testimonials";
import Wrapper from "@/components/Wrapper";
import TranslatedText from "@/lang/TranslatedText";
import { fetchCitiesWithPagination } from "@/requests/city/api";
import { fetchCourses } from "@/requests/courses/api";
import { fetchSpecializationsWithCategories } from "@/requests/specializations/api";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

const Home = async () => {
  const specializationData = await fetchSpecializationsWithCategories();
  const courses = await fetchCourses();
  const cities = await fetchCitiesWithPagination({ page: 1, per_page: 6 });
  return (
    <>
      <Design image={"/Images.png"} search center={true}>
        <div className="flex justify-between w-full px-[10%] md:flex-nowrap flex-wrap relative z-50 mx-auto">
          <div className="space-y-6 text-start">
            <h1 className="md:mt-5 mt-10 md:text-5xl text-2xl mx-10 font-bold text-white">
              <TranslatedText ns="common" textKey="home.one" />{" "}
              <TranslatedText ns="common" textKey="home.two" className="text-secondary" />
            </h1>
            <p className="md:text-lg text-sm mx-10 text-white">
              <TranslatedText ns="common" textKey="home.des" />
              <br />
            </p>
          </div>
          <div className="relative mb-4 flex justify-end w-full">
            <MobileFilter />
          </div>
        </div>
      </Design>
      <div className="md:mt-0 mt-32">
        <SectionTitle
          title="home.cateheadingtitle"
          highlight="home.cateheadinghighlight"
        />
        <SpecializationSection data={specializationData?.data} />
      </div>
      <div>
        <SectionTitle
          title="home.courseheadingtitle"
          highlight="home.courseheadinghighlight"
        />
        <Suspense fallback={<Loading />}>
          <Wrapper full>
            <CourseCarousel courses={courses?.data} />
          </Wrapper>
        </Suspense>
      </div>
      <div className="sm:mt-16">
        <SectionTitle
          title="home.coursecityheadingtitle"
          highlight="home.coursecityheadinghighlight"
        />
        <Suspense fallback={<Loading />}>
          <Carousal data={cities?.data} />
        </Suspense>
      </div>
      <div>
        <RequestCourse />
      </div>
      <div className="sm:mt-16">
        <SectionTitle
          title="home.testimonialsheadingtitle"
          highlight="home.testimonialsheadinghighlight"
        />
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
