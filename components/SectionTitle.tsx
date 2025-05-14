import TranslatedText from "../lang/TranslatedText";
import { ElementType } from "react";

interface SectionTitleProps {
  title?: string;
  highlight?: string;
  element?: ElementType;
}

const SectionTitle = ({
  title,
  highlight,
  element: Heading = "h2",
}: SectionTitleProps) => {
  return (
    <div className="max-w-5xl flex justify-center mx-auto">
      <Heading className="my-6 md:text-3xl text-2xl mx-2 md:mx-32 font-bold text-center text-primary">
        {title && <TranslatedText ns="common" textKey={title} />}{" "}
        <span className="text-[#a9becc]">
          {highlight && <TranslatedText ns="common" textKey={highlight} />}
        </span>
      </Heading>
    </div>
  );
};

export default SectionTitle;
