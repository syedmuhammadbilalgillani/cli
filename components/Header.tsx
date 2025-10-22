"use client";
import { useAuth } from "@/context/AuthContext";
import { useSwitchLanguage } from "@/components/LanguageSwitch";
import Loading from "@/components/Loading";
import { DOMAIN_URL, LOCALE_LANGUAGE } from "@/constant/apiUrl";
import TranslatedText from "@/lang/TranslatedText";
import { Lock, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Types
interface NavLink {
  name: string;
  link: string;
  arabic_name?: string;
}

interface HeaderProps {
  secondary?: boolean;
  icon_white?: boolean;
  bg?: boolean;
}

// Menu configuration based on language
const ENnavLinks: NavLink[] = [
  { name: "Home", link: "/" },
  { name: "Training Course", link: "/training-courses" },
  { name: "Mini Masters", link: "/masters" },
  { name: "Mini Diplomas", link: "/diploma" },
  { name: "Cities", link: "/cities" },
  { name: "Consulting", link: "/consulting-services" },
  { name: "About Us", link: "/about" },
  { name: "Blogs", link: "/blog" },
  { name: "Contact Us", link: "/contact" },
];

const ARnavLinks: NavLink[] = [
  { name: "الرئيسية", link: "/" },
  { name: "دبلوم", link: "/دبلوم" },
  { name: "ماجستير", link: "/الماجستير" },
  { name: "الدورات التدريبية", link: "/الدورات-التدريبية" },
  { name: "المدن", link: "/cities" },
  { name: "الاستشارات", link: "/consulting-services" },
  { name: "من نحن", link: "/about" },
  { name: "مدونة", link: "/blog" },
  { name: "اتصل بنا", link: "/contact" },
];

const menu: NavLink[] = LOCALE_LANGUAGE === "en" ? ENnavLinks : ARnavLinks;

const Header: React.FC<HeaderProps> = ({ secondary, icon_white, bg }) => {
  const pathname = usePathname() || "/";
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { handleSwitchLanguage, isLoading } = useSwitchLanguage();
  const [mounted, setmounted] = useState(false);
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setmounted(true);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Get user initials for avatar
  const getInitials = (name: string): string =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  // JSON-LD Structured Data
  const jsonLd = {
    siteNavigation: {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "@id": `${DOMAIN_URL}/#site-navigation`,
      name:
        LOCALE_LANGUAGE === "ar"
          ? "معهد التاج للتدريب - لندن"
          : "London Crown Institute of Training",
      url: `${DOMAIN_URL}`,
      hasPart: menu.map((item) => ({
        "@type": "SiteNavigationElement",
        name: LOCALE_LANGUAGE === "ar" ? item.name || item.name : item.name,
        url: `${DOMAIN_URL}${item.link}`,
      })),
    },

    breadcrumbs: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: LOCALE_LANGUAGE === "ar" ? "الرئيسية" : "Home",
          item: `${DOMAIN_URL}/`,
        },
        ...pathname
          .split("/")
          .filter(Boolean)
          .map((segment, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name:
              LOCALE_LANGUAGE === "ar"
                ? decodeURIComponent(segment).replace(/-/g, " ")
                : segment.replace(/-/g, " ").toUpperCase(),
            item: `${DOMAIN_URL}/${pathname
              .split("/")
              .slice(1, index + 2)
              .join("/")}`,
          })),
      ],
    },

    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${DOMAIN_URL}/#organization`,
      name:
        LOCALE_LANGUAGE === "ar"
          ? "معهد التاج للتدريب - لندن"
          : "London Crown Institute of Training",
      url: `${DOMAIN_URL}`,
      logo: "/logocrown.webp",
      sameAs: [
        "https://www.linkedin.com/company/london-crown-institute-of-training/",
        "https://x.com/CLI_Trainings",
        "https://www.facebook.com/CrownLondonInstitute/",
        "https://uk.pinterest.com/CLI_Trainings/",
        "https://www.instagram.com/cli_trainings",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+447366513577",
        contactType:
          LOCALE_LANGUAGE === "ar" ? "خدمة العملاء" : "customer service",
        email: "info@clinstitute.co.uk",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress:
          LOCALE_LANGUAGE === "ar"
            ? "الطابق السادس، 2 شارع كينجدوم"
            : "6th Floor, 2 Kingdom St",
        addressLocality: LOCALE_LANGUAGE === "ar" ? "لندن" : "London",
        postalCode: "W2 6BD",
        addressCountry: LOCALE_LANGUAGE === "ar" ? "المملكة المتحدة" : "UK",
      },
    },
  };

  const ImageURL = LOCALE_LANGUAGE === "en" ? "/ar.webp" : "/en.png";

  if (isLoading) return <Loading />;

  return (
    <>
      {mounted &&
        Object.values(jsonLd).map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      {/* Header */}
      <header
        className={`fixed top-0 w-full bg-primary z-[999] transition-all duration-300 ease-in-out ${
          scrolled ? "bg-opacity-100 shadow-lg" : "bg-opacity-90"
        } ${secondary ? "bg-opacity-100" : ""}`}
      >
        <div className="px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo13.png"
                alt="London Crown Institute of Training"
                width={120}
                height={120}
                priority
                className="h-16 object-cover -mt-2"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-6 text-white text-sm">
              {menu?.map((item) => (
                <Link
                  key={item.link}
                  href={item.link ?? "/"}
                  className={`hover:text-white/80 pb-1 border-b-2 transition-colors duration-300 ${
                    pathname === item?.link
                      ? "border-secondary"
                      : "border-transparent"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section: Language Switcher & Auth */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={() =>
                  handleSwitchLanguage(LOCALE_LANGUAGE === "en" ? true : false)
                }
                className="flex items-center text-xs gap-2 py-1.5 px-2 border-[1px] rounded-sm text-white border-slate-50/70"
              >
                <Image
                  src={ImageURL}
                  height={20}
                  width={20}
                  alt="Language Flag"
                />
                {LOCALE_LANGUAGE === "en" ? "العربية" : "English"}
              </button>

              {/* Auth Section */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    className="w-10 flex items-center justify-center bg-secondary text-white font-bold rounded-full text-sm"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {getInitials(user?.name ?? "")}
                  </button>
                  {dropdownOpen && (
                    <div
                      className={`absolute ${
                        LOCALE_LANGUAGE === "en" ? "right-0" : "left-0"
                      } mt-2 w-56 bg-white border rounded shadow-lg text-sm z-[1000]`}
                    >
                      <div className="p-3 border-b text-gray-700">
                        {user?.name}
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <TranslatedText textKey="navbar.profile" />
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-white bg-primary"
                      >
                        <TranslatedText textKey="navbar.logout" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex gap-4">
                  <Link
                    href="/sign-in"
                    className="flex items-center px-4 py-2 text-xs border-secondary border-[1px] hover:text-white rounded hover:bg-secondary/70 text-secondary"
                  >
                    <Lock size={16} className="mx-2" />{" "}
                    <TranslatedText textKey="navbar.login" />
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center px-4 py-2 text-xs text-white rounded bg-secondary"
                  >
                    <Lock size={16} className="mx-2" />
                    <TranslatedText textKey="navbar.signup" />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button className="lg:hidden" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X size={28} color="white" />
                ) : (
                  <Menu size={28} color="white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 w-72 bg-white shadow-md h-full z-[1000] transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out lg:hidden`}
        >
          <div className="bg-primary p-4">
            <div className="flex justify-between items-center -mt-6">
              <Image
                src="/logo13.png"
                alt="Logo"
                width={120}
                height={120}
                priority
              />
              <button onClick={toggleMobileMenu}>
                <X color="white" />
              </button>
            </div>
            {!user && (
              <div className="flex justify-between gap-4 mt-4">
                <Link
                  href="/sign-in"
                  className="flex items-center w-full h-8 px-2 text-nowrap text-xs border-secondary border-[1px] text-white rounded hover:bg-secondary/90"
                  onClick={toggleMobileMenu}
                >
                  <Lock size={16} className="mx-2" />
                  <TranslatedText textKey="navbar.login" />
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center w-full text-nowrap h-8 px-2 text-xs text-white rounded bg-secondary"
                  onClick={toggleMobileMenu}
                >
                  <Lock size={16} className="mx-2" />
                  <TranslatedText textKey="navbar.signup" />
                </Link>
              </div>
            )}
          </div>
          <nav className="mt-8 space-y-4 text-sm px-7">
            {menu.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={`block text-gray-700 hover:text-gray-900 ${
                  pathname === item.link ? "underline" : ""
                }`}
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
