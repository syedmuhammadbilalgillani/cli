import axiosInstance from "@/utils/axios";

export const fetchCategoriesWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/categories?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get(`/categories`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCategoryBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/categories/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCategoryBySpecialization = async ({
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
      `/categories/${slug}/specialization?per_page=${per_page ?? 50}&page=${
        page ?? 1
      }`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
