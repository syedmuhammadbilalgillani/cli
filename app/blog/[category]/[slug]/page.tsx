import Blogs from "@/components/Blogs";
import { BACKEND_URL, DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { fetchBlogBySlug } from "@/requests/blogs/api";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

export const dynamic = "force-dynamic";

// Metadata generation for SEO
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; category: string }> },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, category } = await params;

  const ARABIC_TEXTS = {
    instituteName: "معهد لندن كراون للتدريب",
    defaultMeta: "معهد لندن كراون للتدريب",
  };

  const ENGLISH_TEXTS = {
    instituteName: "London Crown Institute of Training",
    defaultMeta: "London Crown Institute of Training",
  };

  const TEXTS = LOCALE_LANGUAGE === "ar" ? ARABIC_TEXTS : ENGLISH_TEXTS;

  try {
    const product = await fetchBlogBySlug({ slug: slug });

    const title = product?.data?.meta_title || TEXTS.defaultMeta;
    const description = product?.data?.meta_description || TEXTS.defaultMeta;
    const keywords = product?.data?.meta_keywords || TEXTS.defaultMeta;
    const image = product?.data?.image || `${DOMAIN_URL}/Logocrown.webp`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        type: "website",
        locale: LOCALE_LANGUAGE,
        siteName: TEXTS.instituteName,
        title,
        description,
        url: `${DOMAIN_URL}/blog/${category}/${slug}`,
        images: [image],
      },
      alternates: {
        canonical: `${DOMAIN_URL}/blog/${category}/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        creator: TEXTS.instituteName,
        title,
        description,
        images: [
          {
            url: image,
            width: 800,
            height: 600,
            alt: `${TEXTS.instituteName} - Og Image`,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: TEXTS.defaultMeta,
      description: TEXTS.defaultMeta,
      keywords: TEXTS.defaultMeta,
    };
  }
}

// Main Blog Page
const BlogPost = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const data = await fetchBlogBySlug({ slug: slug });
  console.log(data, "data");

  return (
    <>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="px-4 py-8 mx-auto max-w-7xl">
          <h1 className="text-primary text-2xl md:text-4xl text-center font-bold mb-4">
            {data?.data?.title}
          </h1>

          <div className="flex items-center mt-4 md:mt-0 md:ml-4">
            <div className="relative w-full max-h-fit h-full">
              {data?.data?.featured_image === "" ? null : (
                <Image
                  src={data?.data?.featured_image}
                  alt={data?.data?.author}
                  className="object-contain"
                  height={600}
                  width={600}
                />
              )}
            </div>
          </div>

          <div className=" p-2">
            <span className="ml-2 text-gray-600 dark:text-white/70">
              <span className="font-semibold">
                {LOCALE_LANGUAGE === "ar" ? "نشر بواسطة" : "Posted By"}
              </span>{" "}
              : {data?.data?.author}
            </span>
            <span className="text-gray-600">
              {" "}
              |{" "}
              <span className="font-semibold text-gray-600">
                {LOCALE_LANGUAGE === "ar" ? "تاريخ النشر" : "Posted On"}
              </span>{" "}
              : {data?.data?.published_date}
            </span>
          </div>

          <div className="bg-secondary h-[1.5px] my-5" />

          <div
            dangerouslySetInnerHTML={{ __html: data?.data?.content ?? "" }}
          />
        </div>
      </div>
      <Blogs />
    </>
  );
};

export default BlogPost;
