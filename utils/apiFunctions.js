"use server";
import axiosInstance from "./axios";

// Common function to handle GET requests with error fallback
export async function safeGet(url) {
  try {
    console.log(`Fetching ${url}`);
    const response = await axiosInstance.get(url);
    return response?.data;
  } catch (error) {
    return null;
  }
}
// ✅ Safe API fetch helper with retry and silent error handling
export const safeGetErr = async (url, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axiosInstance.get(url);
      return res.data?.data || [];
    } catch (err) {
      if (i === retries) {
        console.error(`❌ Error fetching ${url}:`, err.message);
        return [];
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1s before retry
    }
  }
};

export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    console.log(res, "res");
    if (res.status === 400) return null;
    return res?.data ?? [];
  } catch (error) {
    if (error) return null;
  }
};

// Exported API functions
// meta data
export const fetchCities = async (query) => {
  // console.log("city query", query);
  return safeGet(`/cities?${query}`);
};
export const fetchCity = async (slug) => safeGet(`/cities/${slug}`);
export const fetchCourse = async (slug) => safeGet(`/courses/${slug}`);
export const fetchProgramMetaData = async (slug) =>
  safeGet(`/programs/${slug}`);

export const fetchSpecializationMetaData = async (slug) =>
  safeGet(`/specializations/${slug}`);
export const fetchCategoryMetaData = async (slug) =>
  safeGet(`/categories/${slug}`);

export const fetchSpecializationCategories = async (slug) =>
  safeGet(`/categories/${slug}/specialization`);

export const fetchProgram = async (slug) => safeGet(`/programs/${slug}`);

export const fetchCityCourses = async (slug, query) =>
  safeGet(`/courses/${slug}/cities?${query}`);

export const fetchProgramCourses = async (slug, query) => {
  // const queryString = Object.entries(query)
  //   .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  //   .join('&');
  return safeGet(`/courses/${slug}/programs?${query}`);
};

export const fetchCategoryCourses = async (slug) =>
  safeGet(`/courses/${slug}/categories`);

export const fetchBlogs = async () => safeGet(`/blogs`);
export const fetchPrograms = async () => safeGetErr(`/programs`);
export const fetchAllSpecializations = async () =>
  safeGetErr(`/specializations`);
export const fetchAllCategoryCourses = async (slug) =>
  safeGetErr(`/courses/${slug}/categories`);
export const fetchAllSpecializationCategories = async (slug) =>
  safeGetErr(`/categories/${slug}/specialization`);
