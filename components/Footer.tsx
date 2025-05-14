"use client";

import { LOCALE_LANGUAGE } from "@/constant/apiUrl";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TranslatedText from "../lang/TranslatedText";

type FooterLink = {
  name: string;
  link: string;
};

type SocialLink = {
  Icon: React.ElementType | string;
  href: string;
  image?: boolean;
};

export default function Footer(): JSX.Element {
  const ENLinks: FooterLink[] = [
    { name: "Home", link: "/" },
    { name: "Our Services", link: "/academy-service" },
    { name: "Customer Service", link: "/customer-service" },
    { name: "Sitemap", link: "/sitemap" },
    // { name: "Team Staff", link: "/team-staff" },
    { name: "Profile", link: "/account" },
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Contact Us", link: "/contact" },
  ];

  const ARLinks: FooterLink[] = [
    { name: "الرئيسية", link: "/" },
    { name: "خدماتنا", link: "/academy-service" },
    { name: "خدمة العملاء", link: "/customer-service" },
    { name: "خريطة الموقع", link: "/sitemap" },

    // { name: "الوظائف", link: "/job" },
    // { name: "فريق العمل", link: "/team-staff" },
    { name: "الملف الشخصي", link: "/account" },
    { name: "سياسة الخصوصية", link: "/privacy-policy" },
    { name: "اتصل بنا", link: "/contact" },
  ];

  const FOOTERLINKS: FooterLink[] =
    LOCALE_LANGUAGE === "en" ? ENLinks : ARLinks;

  const socialLinks: SocialLink[] = [
    {
      Icon: Linkedin,
      href: "https://www.linkedin.com/company/london-crown-institute-of-training/",
    },
    {
      Icon: Facebook,
      href: "https://www.facebook.com/CrownLondonInstitute/",
    },
    {
      Icon: Instagram,
      href: "https://www.instagram.com/cli_trainings/",
    },
    {
      Icon: Twitter,
      href: "https://x.com/CLI_Trainings",
    },
    {
      Icon: "/pinterest-round-icon.png",
      href: "https://uk.pinterest.com/CLI_Trainings/",
      image: true,
    },
  ];

  return (
    <footer className="relative border-t-[1px] border-[#c3c3c3] shadow-lg overflow-hidden">
      <div className="bg-white text-primary">
        <div className="container px-4 py-6">
          <div className="md:flex md:flex-row flex flex-col justify-between gap-10">
            {/* Left Column */}
            <div>
              <Image
                src="/Logocrown1.webp"
                alt="trainEdge Logo"
                width={150}
                height={150}
                className="mb-4 -mt-12"
              />
              <div className="space-y-4 px-4">
                <h3 className="text-xl font-semibold">
                  <TranslatedText ns="common" textKey="footer.heading" />
                </h3>
                <p className="text-sm w-full md:w-[250px] leading-relaxed">
                  <TranslatedText ns="common" textKey="footer.desc" />
                </p>
                <div className="flex items-start md:space-x-2">
                  <svg
                    className="w-5 hidden md:block h-5 mt-1 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm md:w-[250px] w-full">
                    <TranslatedText ns="common" textKey="footer.address" />
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Column - World Map */}
            <div className="hidden md:block">
              <Image
                src="/map1.png"
                width={800}
                height={800}
                alt="map"
                className="flex mt-16 items-center justify-center"
              />
            </div>

            {/* Right Column */}
            <div className="w-96 px-4 md:px-0">
              <TranslatedText
                as="h3"
                className="text-xl font-semibold mb-6"
                textKey="footer.quicklinktitle"
              />
              <nav className="space-y-3">
                {FOOTERLINKS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    className="block text-sm hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Social Media Bar */}
        <div className="border-t border-gray-800 bg-primary">
          <div className="mx-auto px-4 py-4">
            <div className="flex justify-center space-x-6">
              {socialLinks.map(({ Icon, href, image }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="text-white hover:text-gray-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {image && typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt="pinterest"
                      className="w-5 h-5 filter invert grayscale hover:invert-75 hover:grayscale transition"
                    />
                  ) : (
                    typeof Icon !== "string" && <Icon className="w-5 h-5" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
