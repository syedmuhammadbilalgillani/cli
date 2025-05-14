import TranslatedText from "@/lang/TranslatedText";
import React from "react";

const Notes = () => {
  return (
    <>
      <main className="min-h-screen bg-white p-6 md:p-12 text-sm">
        <article className="text-start max-w-4xl">
          {/* Header */}
          <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
            <TranslatedText ns="common" textKey="notes.title" />
          </h2>

          {/* Introduction */}
          <p className="mb-8 text-gray-700">
            <TranslatedText ns="common" textKey="notes.intro" />
          </p>

          {/* Course Content */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              <TranslatedText ns="common" textKey="notes.whatItCovers" />
            </h2>
          
            <div className="space-y-6">
              {/* Loop Through Stages */}
              {[
                "initiation",
                "planning",
                "execution",
                "monitoring",
                "closure",
              ].map((stageKey, index) => (
                <section key={stageKey}>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {index + 1}.{" "}
                    <TranslatedText
                      ns="common"
                      textKey={`notes.stages.${stageKey}.title`}
                    />
                  </h3>
                  <ul className="ml-6 list-disc space-y-2 text-gray-700">
                    {[1, 2, 3].map((num) => (
                      <li key={num}>
                        <TranslatedText
                          ns="common"
                          textKey={`notes.stages.${stageKey}.point${num}`}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default Notes;
