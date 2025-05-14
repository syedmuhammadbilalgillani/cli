import Header from "@/components/Header";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { TEXT } from "@/constant/text";
import { AuthProvider } from "@/context/AuthContext";
import I18nClientProvider from "@/lang/I18nClientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const commonKeywordsEn = [
    "Training Courses",
    "Professional Development",
    "Diploma Programs",
    "Master's Programs",
    "Consulting Services",
    "Team Building Workshops",
    "Project Management Courses",
    "Leadership Training",
    "Human Resources Courses",
    "Quality Management Training",
    "Health and Safety Courses",
    "Engineering Training",
    "Information Technology Courses",
    "Public Relations Training",
    "Financial Management Courses",
    "Business Training",
    "Corporate Training Solutions",
    "Employee Development Programs",
    "Online Training Courses",
    "Management Training",
    "Skill Development Workshops",
    "Executive Coaching",
    "Business Consultancy",
    "Workplace Training Programs",
    "Human Resource Management",
    "Continuous Professional Development",
    "Leadership Skills Development",
    "Certified Training Programs",
    "Career Advancement Courses",
    "Workplace Safety Training",
    "Training Institute",
    "Vocational Training Courses",
  ].join(", ");

  const commonKeywordsAr = [
    "دورات تدريبية",
    "تطوير مهني",
    "برامج الدبلوم",
    "برامج الماجستير",
    "خدمات استشارية",
    "ورش عمل لبناء الفريق",
    "دورات إدارة المشاريع",
    "تدريب القيادة",
    "دورات الموارد البشرية",
    "تدريب إدارة الجودة",
    "دورات الصحة والسلامة",
    "التدريب الهندسي",
    "دورات تقنية المعلومات",
    "تدريب العلاقات العامة",
    "دورات الإدارة المالية",
    "التدريب التجاري",
    "حلول تدريب الشركات",
    "برامج تطوير الموظفين",
    "دورات تدريبية عبر الإنترنت",
    "تدريب إداري",
    "ورش عمل لتطوير المهارات",
    "التدريب التنفيذي",
    "الاستشارات التجارية",
    "برامج تدريب مكان العمل",
    "إدارة الموارد البشرية",
    "التطوير المهني المستمر",
    "تطوير مهارات القيادة",
    "برامج تدريب معتمدة",
    "دورات التقدم الوظيفي",
    "تدريب سلامة مكان العمل",
    "معهد تدريب",
    "دورات تدريب مهني",
  ].join("، ");

  const isArabic = LOCALE_LANGUAGE === "ar";

  const title = isArabic ? "معهد لندن كراون للتدريب" : `${TEXT.INSTITUTE_NAME}`;
  const description = isArabic
    ? "يقدم معهد لندن كراون للتدريب دورات تدريبية احترافية بقيادة خبراء لتعزيز مهاراتك وتطوير مسارك المهني."
    : `${TEXT.INSTITUTE_NAME} offers expert-led courses and professional training to enhance your career and skills.`;
  const keywords = isArabic ? commonKeywordsAr : commonKeywordsEn;
  const siteUrl = DOMAIN_URL;
  const imageUrl = `${siteUrl}Logocrown.webp`;
  const locale = isArabic ? "ar_SA" : "en_US";

  const metadata = {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale,
      site_name: title,
      title,
      description,
      url: siteUrl,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: title,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: siteUrl,
    },
  };

  return metadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={LOCALE_LANGUAGE === "en" ? "en" : "ar"}
      dir={LOCALE_LANGUAGE === "ar" ? "rtl" : "ltr"}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster />
        <AuthProvider>
          <I18nClientProvider>
            <Header />
            {children}
            <Footer />
          </I18nClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
