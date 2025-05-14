"use client";

import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react"; // Loader2 for loading spinner
import { fetchCities } from "@/requests/city/api";
import { fetchSpecializations } from "@/requests/specializations/api";
import { toast } from "sonner";
import Loading from "./Loading";

type City = { name: string; slug: string };
type Specialization = { name: string; slug: string };

export default function SearchForm() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cities, setcities] = useState<any>([]);
  const [specializations, setspecializations] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetchCities(),
          fetchSpecializations(),
        ]);
        setcities(citiesRes?.data || []);
        setspecializations(categoriesRes?.data || []);
      } catch (error) {
        // console.error("Failed to fetch data:", error);
        return [];
      }
    };

    fetchData();
  }, []);

  const ENmonths = [
    { name: "January", value: "1" },
    { name: "February", value: "2" },
    { name: "March", value: "3" },
    { name: "April", value: "4" },
    { name: "May", value: "5" },
    { name: "June", value: "6" },
    { name: "July", value: "7" },
    { name: "August", value: "8" },
    { name: "September", value: "9" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];
  const ARmonths = [
    { name: "يناير", value: "1" },
    { name: "فبراير", value: "2" },
    { name: "مارس", value: "3" },
    { name: "أبريل", value: "4" },
    { name: "مايو", value: "5" },
    { name: "يونيو", value: "6" },
    { name: "يوليو", value: "7" },
    { name: "أغسطس", value: "8" },
    { name: "سبتمبر", value: "9" },
    { name: "أكتوبر", value: "10" },
    { name: "نوفمبر", value: "11" },
    { name: "ديسمبر", value: "12" },
  ];

  const EnProgram = [
    { name: "Training Course", link: "/training-courses" },
    { name: "Mini Masters", link: "/masters" },
    { name: "Mini Diplomas", link: "/diploma" },
  ];
  const ArProgram = [
    { name: "دبلوم", link: "/دبلوم" },
    { name: "ماجستير", link: "/الماجستير" },
    { name: "الدورات التدريبية", link: "/الدورات-التدريبية" },
  ];

  const programs = LOCALE_LANGUAGE === "en" ? EnProgram : ArProgram;
  const months = LOCALE_LANGUAGE === "en" ? ENmonths : ARmonths;

  const handleSearch = async () => {
    if (!selectedProgram) {
      toast.error(t("mobilefiltercomponent.toastMessages.programRequired"));
      return;
    }

    setIsSearching(true);

    const queryParams = new URLSearchParams();

    if (selectedMonth) queryParams.append("month", selectedMonth);
    if (selectedSpecialization)
      queryParams.append("specialization", selectedSpecialization);
    if (selectedCity) queryParams.append("city", selectedCity);
    if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

    // Wait 200ms to show spinner nicely
    router.push(`${DOMAIN_URL}/${selectedProgram}?${queryParams.toString()}`);
    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  };
  if (isSearching) return <Loading />;
  return (
    <div className="h-fit px-5 mt-10 md:top-10 md:right-20 md:w-fit w-[cacl(100%-10%)] md:mx-10 mx-auto bg-white rounded-lg shadow-2xl p-6 border border-gray-300">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 border border-[#E5C17C] rounded-lg px-3 py-2 w-full">
        <input
          type="text"
          placeholder={t("mobilefiltercomponent.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-gray-100 text-primary placeholder-gray-400 focus:outline-none text-base px-2 py-2"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="p-2 text-[#E5C17C] hover:bg-secondary hover:text-white transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Search size={24} />
          )}
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Program Dropdown */}
        <select
          className="w-full p-3 bg-white border appearance-none border-[#E5C17C] rounded-lg text-sm text-gray-700 focus:outline-none"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="">{t("mobilefiltercomponent.selectProgram")}</option>
          {programs.map((program) => (
            <option key={program.name} value={program.link}>
              {program.name}
            </option>
          ))}
        </select>

        {/* Specialization Dropdown */}
        <select
          className="w-full p-3 bg-white border appearance-none border-[#E5C17C] rounded-lg text-sm text-gray-700 focus:outline-none"
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
        >
          <option value="">
            {t("mobilefiltercomponent.selectSpecialization")}
          </option>
          {specializations?.map((spec: Specialization) => (
            <option key={spec.slug} value={spec.slug}>
              {spec.name}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          className="w-full p-3 bg-white border appearance-none border-[#E5C17C] rounded-lg text-sm text-gray-700 focus:outline-none"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">{t("mobilefiltercomponent.selectCity")}</option>
          {cities?.map((city: City) => (
            <option key={city.slug} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>

        {/* Month Dropdown */}
        <select
          className="w-full p-3 bg-white border appearance-none border-[#E5C17C] rounded-lg text-sm text-gray-700 focus:outline-none"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">
            {LOCALE_LANGUAGE === "en" ? "Select Month" : "اختر الشهر"}
          </option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
