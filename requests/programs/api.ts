import axiosInstance from "@/utils/axios";

export const fetchPrograms = async () => {
  try {
    console.log("fetching... api for programs");
    const res = await axiosInstance.get(`/programs`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchProgramBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/programs/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
