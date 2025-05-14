import axiosInstance from "@/utils/axios";

export const fetchSpecializationsWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/specializations?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchSpecializations = async () => {
  try {
    const res = await axiosInstance.get(`/specializations`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchSpecializationBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/specializations/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchSpecializationsWithCourses = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/specializations_courses?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchSpecializationsWithCategories = async () => {
  try {
    const res = await axiosInstance.get(`/specializations_categories`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchSpecializationsWithCategoriesAndCourses = async () => {
  try {
    const res = await axiosInstance.get(`/specializations_categories_courses`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
