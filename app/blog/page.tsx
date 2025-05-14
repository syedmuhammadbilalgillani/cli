import React from "react";
import fetchData from "@/actions/server";
import Blogs from "@/components/Blogs";
import BlogsCategory from "@/components/BlogsCategory";
import HeroSection from "@/components/HeroSection";
import { BACKEND_URL, DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { Metadata } from "next";

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  // Add more fields if available
}

interface FetchResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export async function generateMetadata(): Promise<Metadata> {
  const ARABIC_TEXTS = {
    title: "استكشف جميع المدونات - معهد لندن كراون للتدريب",
    description:
      "اكتشف مقالات ومعلومات متميزة من معهد لندن كراون للتدريب، مصدرك الموثوق للتطوير المهني والموارد التعليمية.",
    keywords:
      "معهد لندن كراون للتدريب، التدريب المهني، مدونات التعليم، تطوير المسار المهني، مصادر التعلم",
    instituteName: "معهد لندن كراون للتدريب",
    defaultOgDescription: "معهد لندن كراون للتدريب",
  };

  const ENGLISH_TEXTS = {
    title: "Explore All Blogs - London Crown Institute of Training",
    description:
      "Discover insightful articles and updates from London Crown Institute of Training, your trusted source for professional development and educational resources.",
    keywords:
      "London Crown Institute of Training, professional training, education blogs, career development, learning resources",
    instituteName: "London Crown Institute of Training",
    defaultOgDescription: "London Crown Institute of Training",
  };

  const TEXTS = LOCALE_LANGUAGE === "ar" ? ARABIC_TEXTS : ENGLISH_TEXTS;

  return {
    title: TEXTS.title,
    description: TEXTS.description,
    keywords: TEXTS.keywords.split(", "),
    openGraph: {
      type: "website",
      locale: LOCALE_LANGUAGE,
      siteName: TEXTS.instituteName,
      title: TEXTS.title,
      description: TEXTS.defaultOgDescription,
      url: `${DOMAIN_URL}/blog`,
      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
        },
      ],
    },
    alternates: {
      canonical:`${DOMAIN_URL}/blog`,
    },
    twitter: {
      card: "summary_large_image",
      creator: TEXTS.instituteName,
      title: TEXTS.title,
      description: TEXTS.defaultOgDescription,
      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
          width: 800,
          height: 600,
          alt: `${TEXTS.instituteName} - Og Image`,
        },
      ],
    },
  };
}
export const dynamic = 'force-dynamic';

const Page = async (): Promise<JSX.Element> => {
  let categoryData: BlogCategory[] = [];

  try {
    const category: FetchResponse<BlogCategory[]> = await fetchData(
      `${BACKEND_URL}/blog_categories`
    );
    categoryData = category?.data || [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
  }

  return (
    <div>
      <HeroSection
        imageUrl="/blog3.png"
        heading="consultation.heading"
        localhighlight="blog.blog"
      />
      <div>
        <BlogsCategory category={categoryData as any} />
      </div>

      {/* Latest Blog Section */}
      <Blogs />
    </div>
  );
};

export default Page;
