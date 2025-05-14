import Blogs from "@/components/Blogs";
import HeroSection from "@/components/HeroSection";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { fetchConsultationCategories } from "@/requests/consultations/api";
import Filteration from "./components/Filteration";




export const dynamic = 'force-dynamic';

// Type for the fetched services data
interface Service {
  id: number;
  name: string;
  description: string;
}

// Metadata generation function
export async function generateMetadata() {
  const metadataEn = {
    title: "All Consulting Services - London Crown Institute of Training",
    description:
      "Explore our professional consulting services in the academy, offering expert guidance in education, career development, and personal growth.",
    openGraph: {
      title: "Explore Consulting Services - London Crown Institute of Training",
      description:
        "Get professional consultations in various fields, including career growth, education strategies, and personal development.",
      url: `${DOMAIN_URL}/consulting-services`,
      type: "website",
      images: [
        {
          url: `${DOMAIN_URL}/Logocrown.webp`,
          width: 800,
          height: 600,
          alt: "Consulting Services",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/consulting-services`,
    },
  };

  const metadataAr = {
    title: "جميع خدمات الاستشارات - معهد لندن كراون للتدريب",
    description:
      "اكتشف خدماتنا الاستشارية المهنية في المعهد، والتي تقدم إرشاداً متخصصاً في التعليم، وتطوير الحياة المهنية، والنمو الشخصي.",
    openGraph: {
      title: "استكشف خدمات الاستشارات - معهد لندن كراون للتدريب",
      description:
        "احصل على استشارات احترافية في مختلف المجالات، بما في ذلك تطوير الحياة المهنية، واستراتيجيات التعليم، والتنمية الشخصية.",
      url: "https://ar.clinstitute.co.uk/consulting-services",
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
      canonical: `${DOMAIN_URL}/consulting-services`,
    },
  };

  return LOCALE_LANGUAGE === "en" ? metadataEn : metadataAr;
}

// Page component
const page = async () => {
  // Fetching data
  const services: Service[] = await fetchConsultationCategories();

  return (
    <div>
      <HeroSection
        parentClassName="md:h-[70dvh] h-[50dvh]"
        imageUrl={"/image_consult.png"}
        imageAlt={"Consultations page banner"}
        heading={"consultation.heading"}
        localhighlight={"consultation.highlight"}
      />
      <div className="min-h-screen px-4 py-12 bg-white">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-4xl text-primary font-bold">
            <TranslatedText
              ns="common"
              textKey="consultation.consultation_services_academy"
            />
          </h2>
        </div>
        {/* Filter Bar */}
        <Filteration data={services} />
      </div>

      <Blogs />
    </div>
  );
};

export default page;
