import Image from "next/image";
import SectionTitle1 from "./SectionTitle1"; // Adjust path accordingly

interface HeroSectionProps {
  imageUrl: string;
  imageAlt?: string;
  heading?: string;
  highlight?: string;
  localhighlight?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: string;
  ariaLabel?: string;
  parentClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

const HeroSection = ({
  imageUrl,
  imageAlt,
  heading,
  highlight,
  localhighlight,
  overlayColor = "#061939",
  overlayOpacity = 0.6,
  height = "85dvh",
  parentClassName = "h-[70dvh]",
  ariaLabel = "Hero Section",
  children,
  contentClassName,
}: HeroSectionProps) => {
  return (
    <section
      className={`relative ${parentClassName}`}
      // style={{ height }}
      aria-label={ariaLabel}
    >
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt ?? "Hero Image"}
          layout="fill"
          className="absolute inset-0 object-top object-cover"
          priority
          loading="eager"
        />
      )}
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      ></div>
      {/* SVG Shape */}
      <div>
        <svg
          className="absolute z-10 -bottom-[1px] w-full"
          viewBox="0 0 1920 181"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          aria-hidden="true"
        >
          <ellipse
            cx="898.794"
            cy="241.361"
            rx="1124.16"
            ry="222.412"
            transform="rotate(-4.78237 898.794 241.361)"
            fill="white"
          />
          <path
            d="M1962.46 183.497C1963.54 198.26 1957.06 213.402 1943.34 228.762C1929.62 244.124 1908.77 259.572 1881.45 274.88C1826.81 305.491 1746.61 335.371 1646.68 362.866C1446.85 417.85 1168.49 463.216 858.955 485.911C549.424 508.606 267.417 504.326 61.7081 479.076C-41.159 466.45 -124.868 448.589 -183.383 426.273C-212.644 415.114 -235.521 402.872 -251.337 389.676C-267.151 376.481 -275.775 362.447 -276.858 347.684C-277.94 332.921 -271.455 317.779 -257.735 302.419C-244.013 287.057 -223.166 271.609 -195.845 256.301C-141.211 225.69 -61.0023 195.81 38.923 168.315C238.749 113.331 517.116 67.9645 826.648 45.2696C1136.18 22.5747 1418.19 26.8546 1623.89 52.1046C1726.76 64.7311 1810.47 82.5924 1868.99 104.908C1898.25 116.067 1921.12 128.309 1936.94 141.505C1952.75 154.7 1961.38 168.734 1962.46 183.497Z"
            fill="white"
            stroke="#FBBA07"
            strokeWidth="3"
          />
        </svg>
      </div>
      {/* Main Text Content */}
      <div
        className={`flex relative z-50 flex-col justify-center items-center  w-full h-full ${
          contentClassName ?? "bottom-[5%]"
        }`}
      >
        <SectionTitle1
          title={heading as string}
          className="px-5 my-0"
          highlight={highlight}
          localhighlight={localhighlight}
        />

        {/* Optional Custom Children (Bottom Right) */}
        {children && <div>{children}</div>}
      </div>
    </section>
  );
};

export default HeroSection;
