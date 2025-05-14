import TranslatedText from "../lang/TranslatedText";
import { formatSlug } from "@/utils/formatSlug";
interface SectionTitle1Props {
  title: string;
  highlight?: string;
  localhighlight?: string;
  className?: string;
}

const SectionTitle1 = ({
  title,
  highlight,
  localhighlight,
  className,
}: SectionTitle1Props) => {
  return (
    <h1
      className={`my-6  md:text-4xl text-3xl font-bold text-center text-white ${className}`}
    >
      <TranslatedText ns="common" textKey={title} />{" "}
      {highlight && (
        <span className="text-secondary">
          <TranslatedText ns="common" textKey={formatSlug(highlight)} />
        </span>
      )}
      {localhighlight && (
        <span className="text-secondary">
          <TranslatedText ns="common" textKey={localhighlight} />
        </span>
      )}
    </h1>
  );
};

export default SectionTitle1;
