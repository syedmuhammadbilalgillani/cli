import BlogCarousel from "@/components/BlogCarousel";
import HeroSection from "@/components/HeroSection";
import Loading from "@/components/Loading";
import SectionTitle from "@/components/SectionTitle";
import Wrapper from "@/components/Wrapper";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import {
  fetchConsultationCategoryBySlug,
  fetchConsultationSubCategoryByCategory,
} from "@/requests/consultations/api";
import { formatSlug } from "@/utils/formatSlug";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CategoryFilteration from "../components/CategoryFilteration";

export const dynamic = 'force-dynamic';
export const revalidate = 60;
export const dynamicParams = true;

// Type for the fetched services data
interface Service {
  id: number;
  name: string;
  description: string;
}

// Metadata generation function
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  // Capitalize function for dynamic category title
  const metaData = await fetchConsultationCategoryBySlug({ slug: category });
  console.log(metaData, "meta data");
  const formattedCategory = formatSlug(category ?? "");

  const metadataEn = {
    title: metaData?.data?.meta_title || ` London Crown Institute of Training`,
    description:
      metaData?.data?.meta_description ||
      "Explore our professional consulting services in the academy, offering expert guidance in education, career development, and personal growth.",
    keywords: metaData?.data?.meta_keywords ?? undefined,
    openGraph: {
      title: `Explore Consulting Services in ${formattedCategory} - London Crown Institute of Training`,
      description:
        "Get professional consultations in various fields, including career growth, education strategies, and personal development.",
      url: `https://clinstitute.co.uk/consulting-services/${category}`,
      type: "website",
      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 800,
          height: 600,
          alt: "Consulting Services",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/consulting-services/${category}`,
    },
  };

  const metadataAr = {
    title: metaData?.data?.meta_title || `معهد لندن كراون للتدريب`,
    description:
      metaData?.data?.meta_description ||
      "استكشف خدماتنا الاستشارية المهنية في المعهد، والتي تقدم إرشادًا خبيرًا في التعليم، وتطوير المسار المهني، والنمو الشخصي.",
    keywords: metaData?.data?.meta_keywords ?? undefined,

    openGraph: {
      title: `استكشف خدمات الاستشارات في ${formattedCategory} - معهد لندن كراون للتدريب`,
      description:
        "احصل على استشارات احترافية في مختلف المجالات، بما في ذلك تطوير الحياة المهنية، واستراتيجيات التعليم، والتنمية الشخصية.",
      url: `https://ar.clinstitute.co.uk/consulting-services/${category}`,
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 800,
          height: 600,
          alt: "خدمات الاستشارات",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/consulting-services/${category}`,
    },
  };

  return LOCALE_LANGUAGE === "en" ? metadataEn : metadataAr;
}

// Page component
const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const consultationCategoryDetails = await fetchConsultationCategoryBySlug({
    slug: category,
  });
  const services = await fetchConsultationSubCategoryByCategory({
    slug: category,
  });

  if (services === null || !consultationCategoryDetails) return notFound();
  const [firstWord, ...remainingWords] =
    consultationCategoryDetails.data.title.split(" ");
  const firstPart = formatSlug(firstWord);
  const secondPart = formatSlug(remainingWords.join(" "));
  console.log(services?.blogs, "ss");
  return (
    <Suspense fallback={<Loading />}>
      <div>
        <HeroSection
          parentClassName="md:h-[70dvh] h-[60dvh]"
          imageUrl={"/image_consult.png"}
          imageAlt={"Consultations page banner"}
          heading={firstPart}
          localhighlight={secondPart}
        />
        <div className="min-h-screen px-4 py-12 bg-white">
          <div className="mb-12 text-center">
            <TranslatedText
              textKey={"consultation.consultation_service_in_academy"}
              className="mb-2 text-4xl text-primary font-bold"
              as="h2"
            />
          </div>
          {/* Filter Bar */}
          <CategoryFilteration
            // category={catgory}
            data={services}
            slug={category}
          />
        </div>
        <div className="flex flex-col">
          <SectionTitle
            title="blog.relatedArticles"
            highlight="blog.highlight"
          />
          {services?.blogs?.length > 0 ? (
            <div className="overflow-hidden justify-center gap-4">
              <Wrapper full>
                <BlogCarousel data={services?.blogs} />
              </Wrapper>
            </div>
          ) : (
            <div className="text-center p-5 font-semibold capitalize">
              <TranslatedText textKey="table.noData" />
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default page;
