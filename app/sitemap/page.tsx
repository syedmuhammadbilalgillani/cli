import SectionTitle from "@/components/SectionTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { TEXT } from "@/constant/text";
import TranslatedText from "@/lang/TranslatedText";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
export const dynamic = 'force-dynamic';
export function generateMetadata() {
  const metadataEn = {
    title: "Sitemap - London Crown Institute of Training",
    description:
      LOCALE_LANGUAGE === "ar"
        ? "يقدم معهد لندن كراون للتدريب دورات تدريبية احترافية بقيادة خبراء لتعزيز مهاراتك وتطوير مسارك المهني."
        : `${TEXT.INSTITUTE_NAME} offers expert-led courses and professional training to enhance your career and skills.`,
    openGraph: {
      title: "Academy Services - London Crown Institute of Training",
      description:
        "Take the first step towards unlocking your full potential. Contact us today to learn more about our services and how we can tailor them to your unique needs.",
      url: "https://clinstitute.co.uk/academy-services",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "https://clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "Academy Services - London Crown Institute of Training",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Academy Services - London Crown Institute of Training",
      description:
        "Take the first step towards unlocking your full potential. Contact us today to learn more about our services and how we can tailor them to your unique needs.",
      images: ["https://clinstitute.co.uk/Logocrown.webp"],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/sitemap`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  const metadataAr = {
    title: "خدمات الأكاديمية - معهد لندن كراون للتدريب",
    description:
      "ابدأ الآن رحلتك نحو تحقيق إمكانياتك الكاملة. تواصل معنا اليوم لمعرفة المزيد حول خدماتنا وكيف يمكننا تخصيصها لتناسب احتياجاتك الفردية.",
    openGraph: {
      title: "خدمات الأكاديمية - معهد لندن كراون للتدريب",
      description:
        "ابدأ الآن رحلتك نحو تحقيق إمكانياتك الكاملة. تواصل معنا اليوم لمعرفة المزيد حول خدماتنا وكيف يمكننا تخصيصها لتناسب احتياجاتك الفردية.",
      url: "https://ar.clinstitute.co.uk/sitemap",
      locale: "ar_SA",
      type: "website",
      images: [
        {
          url: "https://ar.clinstitute.co.uk/Logocrown.webp",
          width: 1200,
          height: 630,
          alt: "خدمات الأكاديمية - معهد لندن كراون للتدريب",
        },
      ],
    },
    alternates: {
      canonical: `${DOMAIN_URL}/sitemap`,
    },
    twitter: {
      card: "summary_large_image",
      title: "خدمات الأكاديمية - معهد لندن كراون للتدريب",
      description:
        "ابدأ الآن رحلتك نحو تحقيق إمكانياتك الكاملة. تواصل معنا اليوم لمعرفة المزيد حول خدماتنا وكيف يمكننا تخصيصها لتناسب احتياجاتك الفردية.",
      images: ["https://ar.clinstitute.co.uk/Logocrown.webp"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  return LOCALE_LANGUAGE === "ar" ? metadataAr : metadataEn;
}
export default async function ApiDataPage() {
  const res = await axiosInstance.get("/sitemap");
  const apiData = res?.data || [];
  const Title = [
    "Course Venues",
    "Training Programs",
    "أماكن الدورة",
    "البرامج التدريب",
  ];
  return (
    <div className="py-12">
      <SectionTitle
        title={LOCALE_LANGUAGE === "en" ? "Sitemap" : "خريطة الموقع"}
        element="h1"
      />

      <div className="container mx-auto px-4">
        {apiData?.map((section: any, index: any) => (
          <Card key={index} className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent
              className={`${
                Title.includes(section.title) &&
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {section?.data?.map((item: any, idx: number) => (
                <div key={idx} className="mb-6">
                  {item?.courses ? (
                    <>
                      {item?.sub_title && (
                        <h2 className="text-xl font-semibold mb-3">
                          {item?.sub_title}
                        </h2>
                      )}
                      {item?.courses?.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {item?.courses?.map(
                            (course: any, courseIdx: number) => (
                              <div key={courseIdx}>
                                <Link
                                  href={course?.path}
                                  className="text-blue-500 hover:underline block"
                                >
                                  {course?.title}
                                </Link>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <TranslatedText
                          textKey="table.noData"
                          as="p"
                        ></TranslatedText>
                      )}
                    </>
                  ) : (
                    <div>
                      <Link
                        href={item?.path}
                        className="text-blue-500 hover:underline text-lg"
                      >
                        {item?.name || item?.title}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
