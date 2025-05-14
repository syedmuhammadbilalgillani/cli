"use client";
import { DOMAIN_URL } from "@/constant/apiUrl";
import { fetchBlogs } from "@/requests/blogs/api";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import BlogCarousel from "./BlogCarousel";
import Loading from "./Loading";
import SectionTitle from "./SectionTitle";
import Wrapper from "./Wrapper";

const generateBlogSchema = (blogs: any[]) => {
  if (!blogs) return {};
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Crown London Institute Blog",
    url: `${DOMAIN_URL}/blog`,
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.featured_image,
      author: {
        "@type": "Organization",
        name: blog.author,
      },
      datePublished: new Date(
        blog.published_date.split("-").reverse().join("-")
      ).toISOString(),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${DOMAIN_URL}/blog/${blog.slug}`,
      },
      description: blog.meta_description,
    })),
  };
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogsData = async () => {
      try {
        const response = await fetchBlogs();
        const fetchedBlogs = response?.data ?? [];
        setBlogs(fetchedBlogs);
      } catch (error) {
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    // console.log(error, "blog component error occured");
    return notFound();
  }

  return (
    <div className="flex flex-col">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogSchema(blogs)),
        }}
      /> */}
      <SectionTitle title="blog.relatedArticles" highlight="blog.highlight" />
      <div className="overflow-hidden justify-center gap-4">
        <Wrapper full>
          <BlogCarousel data={blogs} />
        </Wrapper>
      </div>
    </div>
  );
};

export default Blogs;
