import axiosInstance from "@/utils/axios";

export const fetchBlogsWithPagination = async ({
  page,
  per_page,
}: {
  page?: number;
  per_page?: number;
}) => {
  try {
    const res = await axiosInstance.get(
      `/blogs?per_page=${per_page ?? 50}&page=${page ?? 1}`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchBlogs = async () => {
  try {
    const res = await axiosInstance.get(`/blogs`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchBlogBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/blogs/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchBlogCategoryBySlug = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(`/blog_category_meta/${slug}`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
export const fetchBlogArticleCard = async ({ slug }: { slug: string }) => {
  try {
    const res = await axiosInstance.get(
      `/blogs/${slug}/category?per_page=20&page=1`
    );
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};

export const fetchBlogCategories = async () => {
  try {
    const res = await axiosInstance.get(`/blog_categories`);
    return res.data ?? null;
  } catch (error) {
    return null;
  }
};
