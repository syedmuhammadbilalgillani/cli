"use client"
import { fetchCategories } from "@/requests/categories/api";
import { fetchCities } from "@/requests/city/api";
import { fetchSpecializations } from "@/requests/specializations/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Option {
  id: number;
  name: string;
  slug: string;
}

interface FilterValues {
  searchInput: string;
  selectedMonth: string;
  selectedYear: string;
  selectedSpecialization: string;
  selectedCategory: string;
  selectedCity: string;
}

interface FiltersProps {
  filterValues: FilterValues;
  setFilterValues: (values: FilterValues) => void;
  onSearch: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  filterValues,
  setFilterValues,
  onSearch,
}) => {
  const [specializations, setSpecializations] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const { t } = useTranslation();

  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [specRes, catRes, cityRes] = await Promise.all([
          fetchSpecializations().then(),
          fetchCategories().then(),
          fetchCities().then(),
        ]);
        setSpecializations(specRes?.data || []);
        setCategories(catRes?.data || []);
        setCities(cityRes?.data || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilterValues({ ...filterValues, [key]: value });
  };

  return (
    <div className="text-primary flex flex-col items-center w-full max-w-4xl p-6 bg-opacity-90 rounded-lg md:p-8">
      {/* Search Input */}
      <div className="w-full mb-4">
        <div className="flex items-center p-2 bg-white rounded-md shadow-md md:p-3">
          <input
            type="text"
            placeholder={t("filters.searchPlaceholder")}
            value={filterValues.searchInput}
            onChange={(e) => handleChange("searchInput", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-grow px-4 py-2 text-sm rounded-md md:text-base placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={onSearch}
            className="px-4 py-2 ml-2 text-sm text-white transition-colors bg-primary rounded-md md:text-base md:px-6 md:py-2 hover:bg-primary/80"
          >
            {t("filters.searchButton")}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
        {/* Month */}
        <select
          value={filterValues.selectedMonth}
          onChange={(e) => handleChange("selectedMonth", e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 bg-white text-primary rounded-md md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t("filters.monthLabel")}</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month.toString()}>
              {t(`filters.months.${month}`)}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={filterValues.selectedYear}
          onChange={(e) => handleChange("selectedYear", e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 bg-white text-primary rounded-md md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t("filters.yearLabel")}</option>
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>

        {/* Specialization */}
        <select
          value={filterValues.selectedSpecialization}
          onChange={(e) =>
            handleChange("selectedSpecialization", e.target.value)
          }
          className="w-full px-4 py-2 text-sm border border-gray-300 bg-white text-primary rounded-md md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t("filters.specializationLabel")}</option>
          {specializations.map((spec) => (
            <option key={spec.id} value={spec.slug}>
              {spec.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={filterValues.selectedCategory}
          onChange={(e) => handleChange("selectedCategory", e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 bg-white text-primary rounded-md md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t("filters.categoryLabel")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={filterValues.selectedCity}
          onChange={(e) => handleChange("selectedCity", e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 bg-white text-primary rounded-md md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t("filters.cityLabel")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
