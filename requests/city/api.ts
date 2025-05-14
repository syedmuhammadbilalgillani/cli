import axiosInstance from "@/utils/axios";

export const fetchCitiesWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/cities?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCities = async () => {
  try {
    const res = await axiosInstance.get(`/cities`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchCityBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/cities/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
