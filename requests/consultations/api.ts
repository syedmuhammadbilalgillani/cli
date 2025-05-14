import axiosInstance from "@/utils/axios";

export const fetchConsultationSubCategoriesWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/consultations?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchConsultationSubCategories = async () => {
  try {
    const res = await axiosInstance.get(`/consultations`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchConsultationSubCategoryBySlug = async ({
  slug,
}: {
  slug: string;
}) => {
  try {
    const res = await axiosInstance.get(`/consultations/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchConsultationCategoryBySlug = async ({
  slug,
}: {
  slug: string;
}) => {
  try {
    const res = await axiosInstance.get(`/consultation-category-meta/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchConsultationSubCategoryByCategory = async ({
  slug,
  page,
  per_page,
}: {
  slug: string;
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/consultations/${slug}/category?per_page=${per_page ?? 50}&page=${
        page ?? 1
      }`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchConsultationCategories = async () => {
  try {
    const res = await axiosInstance.get(`/consultation_categories`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchConsultationWithCategoriesForSitemap = async () => {
  try {
    const res = await axiosInstance.get(`/consultation_with_category`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
