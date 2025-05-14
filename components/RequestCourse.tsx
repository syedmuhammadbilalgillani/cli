"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Wrapper from "./Wrapper";
import axiosInstance from "@/utils/axios";
import TranslatedText from "../lang/TranslatedText";
import { useTranslation } from "react-i18next";
import { fetchCities } from "@/requests/city/api";
import { fetchCategories } from "@/requests/categories/api";

// -----------------
// Types
// -----------------
interface City {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const schema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z
    .string()
    .regex(/^[0-9]{11}$/, { message: "Mobile number must be 11 digits" }),
  category: z.string().min(1, { message: "Please select a category" }),
  city: z.string().min(1, { message: "Please select a city" }),
});

type FormData = z.infer<typeof schema>;

// -----------------
// Component
// -----------------
function RequestCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Fetch Cities and Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetchCities(),
          fetchCategories(),
        ]);
        setCities(citiesRes?.data || []);
        setCategories(categoriesRes?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle Form Submit
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    console.log(data, "data");

    const formData = new FormData();
    formData.append("full_name", data.fullName);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("category_id", data.category);
    formData.append("city_id", data.city);

    formData.forEach((value, key) => {
      console.log(key, ":", value);
    });

    try {
      const res = await axiosInstance.post("/course-request", formData);
      console.log(res, "res for course request");
      setSuccessMessage("Request sent successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper full>
      <div className="md:container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-32 md:py-10">
          {/* Left Content */}
          <div className="text-center md:text-left w-full md:w-1/2 lg:w-1/3 pb-6 md:pb-0">
            <h2 className="text-2xl md:text-5xl font-bold text-[#fcc839]">
              <TranslatedText ns="common" textKey="home.reqacourse" />
            </h2>
            <p className="text-gray-100 text-sm mt-2 md:text-base">
              <TranslatedText ns="common" textKey="home.reqacoursedec" />
            </p>
          </div>

          {/* Right Form */}
          <div className="bg-white w-full md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-md border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-gray-700 text-sm font-medium">
                  <TranslatedText ns="common" textKey="form.fullname" />
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder={t("form.fullnameplaceholder")}
                  className="w-full mt-1 px-3 py-2 text-primary rounded border border-secondary focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs text-start mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium">
                    <TranslatedText ns="common" textKey="form.email" />
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder={t("form.emailplaceholder")}
                    className="w-full mt-1 px-3 py-2 text-primary rounded border border-secondary focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs text-start mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium">
                    <TranslatedText ns="common" textKey="form.phnnumber" />
                  </label>
                  <input
                    {...register("mobile")}
                    type="tel"
                    placeholder={t("form.phnnumberplaceholder")}
                    className="w-full mt-1 px-3 py-2 text-primary rounded border border-secondary focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-sm"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs text-start mt-1">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium">
                    <TranslatedText ns="common" textKey="form.category" />
                  </label>
                  <select
                    {...register("category")}
                    className="w-full mt-1 px-3 py-2 text-primary rounded border border-secondary focus:ring-2 focus:ring-amber-400 focus:outline-none transition bg-white appearance-none text-sm"
                  >
                    <option value="">{t("form.selectcategory")}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs text-start mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium">
                    <TranslatedText ns="common" textKey="form.city" />
                  </label>
                  <select
                    {...register("city")}
                    className="w-full mt-1 px-3 py-2 text-primary rounded border border-secondary focus:ring-2 focus:ring-amber-400 focus:outline-none transition bg-white appearance-none text-sm"
                  >
                    <option value="">{t("form.selectcity")}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs text-start mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-white font-medium py-2 px-4 rounded-md hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <TranslatedText
                    ns="common"
                    textKey={isSubmitting ? "form.processing" : "form.sendreq"}
                  />
                </button>
              </div>
            </form>

            {/* Success Message */}
            {successMessage && (
              <div className="mt-4 text-xs text-primary text-start font-semibold">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default RequestCourse;
