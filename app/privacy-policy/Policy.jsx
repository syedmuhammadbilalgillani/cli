'use client';

import TranslatedText from '@/lang/TranslatedText';
import { cn } from '@/lib/utils';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

const sectionIds = [
  "introduction",
  "information-we-collect",
  "how-we-use-your-data",
  "data-retention",
  "data-security",
  "sharing-your-data",
  "your-rights",
  "contact",
  "updates"
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title><TranslatedText ns="common" textKey="metaTitle" /></title>
        <meta name="description" content="At London Crown Institute of Training, we're committed to assisting you at every stage." />
        <meta property="og:title" content="Privacy Policy - London Crown Institute of Training" />
        <meta property="og:description" content="At London Crown Institute of Training, we're committed to assisting you at every stage." />
      </Head>


      <div className="bg-[#0A1828] py-4">
        <h1 className="text-center md:mt-10 md:pt-6 text-3xl font-bold text-white">
          <TranslatedText ns="common" textKey="privacyPolicy.title" />
        </h1>
      </div>

      <div className="flex min-h-screen flex-col lg:flex-row text-left bg-white">
        {/* Sidebar */}
        <nav
          className={cn(
            "lg:w-[320px] border-r mt-2 bg-white transition-transform transform lg:block",
            isSidebarOpen ? "block" : "lg:block hidden"
          )}
        >
          <div className="sticky top-0 p-4 lg:p-6 mt-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden block p-4 mb-4 text-lg font-bold text-black"
            >
              {isSidebarOpen ? "Close Menu" : "Open Menu"}
            </button>
            <div className="space-y-1">
              {sectionIds.map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "w-full text-left px-2 py-1 text-sm rounded-md transition-all text-black",
                    activeSection === id ? "text-black font-bold" : "text-black/70 font-medium"
                  )}
                >
                  <TranslatedText ns="common" textKey={`privacyPolicy.sections.${id}.title`} />
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-4 lg:p-6 overflow-hidden bg-white flex-1">
          <div className="max-w-5xl mx-auto space-y-8">
            {sectionIds.map((id) => (
              <section
                key={id}
                id={id}
                className={cn(
                  "scroll-mt-16 transition-opacity duration-300 p-4 text-black",
                  activeSection === id
                    ? "opacity-100 text-black"
                    : "opacity-80 text-black/70"
                )}
              >
                <h2 className="text-xl font-semibold mb-2">
                  <TranslatedText ns="common" textKey={`privacyPolicy.sections.${id}.title`} />
                </h2>
                <p className="whitespace-pre-line text-base">
                  <TranslatedText ns="common" textKey={`privacyPolicy.sections.${id}.content`} />
                </p>
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
