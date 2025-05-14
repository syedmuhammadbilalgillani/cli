import SectionTitle from "@/components/SectionTitle";
import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const metadataEn: Metadata = {
    title: "About us - London Crown Institute of Training",
    description:
      "At Crown London Institute, we empower professionals with cutting-edge training programs that transform futures. Discover our mission and vision.",
    openGraph: {
      title: "About us - London Crown Institute of Training",
      description:
        "At Crown London Institute, we empower professionals with cutting-edge training programs that transform futures. Discover our mission and vision.",
      url: "https://clinstitute.co.uk/about",
      type: "website",

      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 800,
          height: 600,
          alt: "Crown London Institute",
        },
      ],
    },
    alternates: {
      canonical: "https://clinstitute.co.uk/about",
    },
    twitter: {
      card: "summary_large_image",
      title: "About us - London Crown Institute of Training",
      description:
        "At Crown London Institute, we empower professionals with cutting-edge training programs that transform futures. Discover our mission and vision.",
    },
  };

  const metadataAr: Metadata = {
    title: "من نحن - معهد لندن كراون للتدريب",
    description:
      "في معهد كراون لندن، نُمكن المحترفين من خلال برامج تدريب متطورة تغير المستقبل. اكتشف رسالتنا ورؤيتنا.",
    openGraph: {
      title: "من نحن - معهد لندن كراون للتدريب",
      description:
        "في معهد كراون لندن، نُمكن المحترفين من خلال برامج تدريب متطورة تغير المستقبل. اكتشف رسالتنا ورؤيتنا.",
      url: "https://ar.clinstitute.co.uk/about",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 800,
          height: 600,
          alt: "معهد كراون لندن",
        },
      ],
    },
    alternates: {
      canonical: "https://ar.clinstitute.co.uk/about",
    },
    twitter: {
      card: "summary_large_image",
      title: "من نحن - معهد لندن كراون للتدريب",
      description:
        "في معهد كراون لندن، نُمكن المحترفين من خلال برامج تدريب متطورة تغير المستقبل. اكتشف رسالتنا ورؤيتنا.",
    },
  };

  return LOCALE_LANGUAGE === "ar" ? metadataAr : metadataEn;
}

interface Benefit {
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    title: "about.benefits.expertInstructorsTitle",
    description: "about.benefits.expertInstructorsDescription",
  },
  {
    title: "about.benefits.practicalLearningTitle",
    description: "about.benefits.practicalLearningDescription",
  },
  {
    title: "about.benefits.customizedTrainingTitle",
    description: "about.benefits.customizedTrainingDescription",
  },
];

export default function ConsultingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-base">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:mt-10 md:pt-6 font-bold mb-2 uppercase text-primary">
          <SectionTitle element={"span"} title={"about.head.headerTitle"} />
        </h1>
        <p className="text-gray-600">
          <TranslatedText textKey={"about.head.headerSubtitle"} />
        </p>
      </div>

      {/* Hero Section */}
      <Hero />

      {/* What We Do Section */}
      <div className="my-16">
        <TranslatedText
          as="h2"
          textKey={"about.head.whatWeDoTitle"}
          className="text-2xl text-primary font-bold mb-4"
        />
        <TranslatedText
          as="p"
          textKey={"about.head.whatWeDoDescription"}
          className="text-gray-600 mb-4"
        />
      </div>

      <div className="flex justify-center mb-20">
        <div className="flex flex-row gap-16 justify-center text-gray-600 md:p-6 md:px-10 rounded-full md:bg-[#f9f9f9] flex-wrap">
          <Stats number={95} icon="%" text="about.head.stats.satisfaction" />
          <Stats number={5000} icon="+" text="about.head.stats.trained" />
          <Stats number={100} icon="+" text="about.head.stats.partners" />
          <Stats number={85} icon="%" text="about.head.stats.repeatClients" />
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <TranslatedText
            as="h3"
            textKey={"about.head.missionTitle"}
            className="text-2xl font-bold mb-4 text-primary"
          />
          <TranslatedText
            as="p"
            textKey={"about.head.missionDescription"}
            className="text-gray-600 mb-4"
          />
        </div>
        <div>
          <Image
            src="/aboutus.webp"
            alt="Digital tablet"
            width={500}
            height={300}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="text-center mb-12">
        <TranslatedText
          as="h2"
          textKey={"about.head.offerTitle"}
          className="text-2xl font-bold mb-8 text-primary"
        />
        <div className="grid md:grid-cols-2 items-start gap-8">
          {[
            "corporateTraining",
            "executiveDev",
            "technicalCourses",
            "complianceTraining",
          ].map((key) => (
            <div key={key} className="flex items-start gap-4">
              <div className="bg-primary p-4 rounded-lg">
                <div className="w-8 h-8 text-white">
                  {/* You may replace with actual icons if needed */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <TranslatedText
                  as="h3"
                  textKey={`about.head.offer.${key}Title`}
                  className="font-bold mb-2 text-gray-600"
                />
                <TranslatedText
                  as="p"
                  textKey={`about.head.offer.${key}Description`}
                  className="text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <div className="grid md:grid-cols-2 md:mx-20 mb-20">
          <div className="hidden md:block relative">
            <Image
              src="/about.webp"
              alt="Person pointing"
              width={500}
              height={500}
              className="rounded-lg z-50 p-4"
            />
            <div className="bg-[#efd8c9] absolute bottom-0 w-[70%] -z-10 rounded-lg h-[70%]" />
          </div>
          <div className="flex justify-center">
            <div className="flex justify-center flex-col">
              <TranslatedText
                textKey={"about.head.whyChooseUsTitle"}
                className="text-2xl text-center font-bold mb-6 text-primary"
                as="h2"
              />
              <div className="flex justify-center">
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start md:gap-4 gap-2"
                    >
                      <CheckCircle className="w-10 md:w-6 h-6 text-blue-900 flex-shrink-0" />
                      <div className="space-x-1">
                        <TranslatedText
                          as="h3"
                          textKey={benefit.title}
                          className="text-gray-600"
                        />
                        <TranslatedText
                          textKey={benefit.description}
                          className="text-sm text-gray-400 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
