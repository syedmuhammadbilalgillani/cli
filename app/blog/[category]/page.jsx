// app/blogs/[category]/category/page.js
import { Blog_Category } from "@/components/Blog_Category";
import Blogs from "@/components/Blogs";
import HeroSection from "@/components/HeroSection";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchBlogCategoryBySlug } from "@/requests/blogs/api";
import { notFound } from "next/navigation";
import { fetchBlogArticleCard } from "../../../requests/blogs/api";
export const revalidate = 60; // Revalidate data every 60 seconds
export const dynamic = "force-dynamic";
export const dynamicParams = true;

// Fetch Metadata Dynamically
export async function generateMetadata({ params }) {
  const { category } = await params;

  // Arabic fallback texts
  const ARABIC_TEXTS = {
    instituteName: "معهد لندن كراون للتدريب",
    notFoundTitle: "القسم غير موجود - معهد لندن كراون للتدريب",
    notFoundDescription: "القسم المطلوب في المدونة غير موجود.",
    defaultDescription: "استكشف مقالاتنا ومدوناتنا وأفكارنا.",
    defaultKeywords: "تدريب، تعليم، مدونة، مقالات",
    blogTitle: "المدونة - معهد لندن كراون للتدريب",
  };

  // English fallback texts
  const ENGLISH_TEXTS = {
    instituteName: "London Crown Institute of Training",
    notFoundTitle: "Category Not Found - London Crown Institute of Training",
    notFoundDescription: "The requested blog category could not be found.",
    defaultDescription: "Explore our blog articles and insights",
    defaultKeywords: "training, education, blog, articles",
    blogTitle: "Blog - London Crown Institute of Training",
  };

  const TEXTS = LOCALE_LANGUAGE === "ar" ? ARABIC_TEXTS : ENGLISH_TEXTS;

  try {
    const metaData = await fetchBlogCategoryBySlug({ slug: category });

    if (!metaData) {
      return {
        title: TEXTS.notFoundTitle,
        description: TEXTS.notFoundDescription,
      };
    }

    const title = `${metaData?.data?.meta_title}` || `${TEXTS.instituteName}`;

    const description =
      metaData?.data?.meta_description || TEXTS.defaultDescription;

    const keywords = metaData?.data?.meta_keywords || TEXTS.defaultKeywords;

    return {
      title,
      description,
      keywords,
      openGraph: {
        type: "website",
        title,
        description,
        siteName: TEXTS.instituteName,
        url: `${DOMAIN_URL}/blog/${category}`,
        images: [
          {
            url:
              metaData?.data?.featured_image || `${DOMAIN_URL}/Logocrown.webp`,
            width: 1200,
            height: 630,
            alt: `${metaData?.data?.meta_title} - ${TEXTS.instituteName}`,
          },
        ],
      },
      alternates: {
        canonical: `${DOMAIN_URL}/blog/${category}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@LondonCrownInst",
        images: [
          metaData?.data?.featured_image || `${DOMAIN_URL}/Logocrown.webp`,
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: TEXTS.blogTitle,
      description: TEXTS.defaultDescription,
    };
  }
}

// Main Page Component with SSR
export default async function Page({ params }) {
  const { category } = await params;

  try {
    const articles = await fetchBlogArticleCard({ slug: category });
    const data = await fetchBlogCategoryBySlug({ slug: category });
    console.log(articles, "articles");
    // If no articles found for this category
    if (!articles?.data || articles?.data?.length === 0) {
      return notFound();
    }

    return (
      <>
        <HeroSection
          imageUrl={"/blog3.png"}
          heading={data?.data?.title}
          // highlight={data?.data?.title}
        />
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <div className="flex justify-center">
            <Blog_Category initialArticles={articles} params={category} />
          </div>
        </div>

        <Blogs />
      </>
    );
  } catch (error) {
    // console.error("Error rendering page:", error);
    return notFound();
  }
}
