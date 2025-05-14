import axiosInstance from "@/utils/axios";

/**
 * Fetches courses based on provided filters (only sends non-empty params).
 * @param {Object} params - Filter options.
 * @param {string} [params.specialization] - Course specialization.
 * @param {string} [params.category] - Course category.
 * @param {string} [params.program] - Program type.
 * @param {string} [params.city] - Location filter.
 * @param {string|number} [params.month] - Month filter.
 * @param {string|number} [params.year] - Year filter.
 * @returns {Promise<Object>} - Fetched courses data.
 */
export async function fetchCoursesWithFilteration(params = {}) {
  // Filter out empty/null/undefined params
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  try {
    const response = await axiosInstance.get("/courses", {
      params: filteredParams,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw error; // Re-throw for handling in components
  }
}

export const fetchCoursesWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/courses?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchCourses = async () => {
  try {
    const res = await axiosInstance.get(`/courses`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchCoursesBySpecializationAndCategory = async ({
  specialization,
  category,
}: {
  specialization: string;
  category: string;
}) => {
  try {
    const res = await axiosInstance.get(
      `/courses_specializations_categories/${specialization}/${category}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesByCategory = async ({
  category,
}: {
  category: string;
}) => {
  try {
    const res = await axiosInstance.get(`/courses/${category}/categories`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesBySpecialization = async ({
  specializations,
}: {
  specializations: string;
}) => {
  try {
    const res = await axiosInstance.get(
      `/courses/${specializations}/specializations`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchCourseDetails = async ({
  course_slug,
}: {
  course_slug?: string;
}) => {
  try {
    const res = await axiosInstance.get(`/courses/${course_slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchFeaturedCoursesWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/featured-courses?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchCoursesByCityWithPagination = async ({
  city_slug,
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
  city_slug: string;
}) => {
  try {
    const res = await axiosInstance.get(
      `/courses/${city_slug}/cities?per_page=${per_page ?? 50}&page=${
        page ?? 1
      }`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesByProgramWithPagination = async ({
  program_slug,
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
  program_slug: string;
}) => {
  try {
    console.log("fetching... api for fetchCoursesByProgramWithPagination");

    const res = await axiosInstance.get(
      `/courses/${program_slug}/programs?per_page=${per_page ?? 50}&page=${
        page ?? 1
      }`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesByCategoryWithPagination = async ({
  category_slug,
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
  category_slug: string;
}) => {
  try {
    const res = await axiosInstance.get(
      `/courses/${category_slug}/categories?per_page=${per_page ?? 50}&page=${
        page ?? 1
      }`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesByCity = async ({
  city_slug,
}: {
  city_slug?: string;
}) => {
  try {
    const res = await axiosInstance.get(`/courses/${city_slug}/cities`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCoursesByProgram = async ({ slug }: { slug?: string }) => {
  try {
    const res = await axiosInstance.get(`/courses/${slug}/programs`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
