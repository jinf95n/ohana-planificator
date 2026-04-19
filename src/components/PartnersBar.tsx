/**
 * Subtle, elegant tech-partner bar.
 * Crisp, aligned wordmarks rendered with consistent baseline & sizing.
 */

const LOGO_HEIGHT = "h-7"; // unified visual height for alignment

const McmDigitalLogo = () => (
  <svg
    viewBox="0 0 180 28"
    className={`${LOGO_HEIGHT} w-auto`}
    aria-label="MCM Digital"
    preserveAspectRatio="xMidYMid meet"
  >
    <text
      x="0"
      y="20"
      fill="currentColor"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="18"
      fontWeight="700"
      letterSpacing="0.5"
    >
      MCM
    </text>
    <text
      x="56"
      y="20"
      fill="currentColor"
      opacity="0.55"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="14"
      fontWeight="300"
      letterSpacing="3"
    >
      DIGITAL
    </text>
  </svg>
);

const ValyTechLogo = () => (
  <svg
    viewBox="0 0 170 28"
    className={`${LOGO_HEIGHT} w-auto`}
    aria-label="vly TECH"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* small triangle accent */}
    <path
      d="M2 6 L10 22 L18 6 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="20"
      fill="currentColor"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="18"
      fontWeight="700"
      letterSpacing="0.5"
    >
      vly
    </text>
    <text
      x="62"
      y="20"
      fill="currentColor"
      opacity="0.55"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="14"
      fontWeight="300"
      letterSpacing="3"
    >
      TECH
    </text>
  </svg>
);

const AnthropicLogo = () => (
  <svg
    viewBox="0 0 170 28"
    className={`${LOGO_HEIGHT} w-auto`}
    aria-label="Anthropic"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* cleaner asterisk-like glyph */}
    <g fill="currentColor">
      <rect x="9" y="4" width="2.4" height="20" rx="1" transform="rotate(0 10.2 14)" />
      <rect x="9" y="4" width="2.4" height="20" rx="1" transform="rotate(60 10.2 14)" />
      <rect x="9" y="4" width="2.4" height="20" rx="1" transform="rotate(120 10.2 14)" />
    </g>
    <text
      x="26"
      y="20"
      fill="currentColor"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="18"
      fontWeight="500"
      letterSpacing="0.5"
    >
      Anthropic
    </text>
  </svg>
);

const NextSparkLogo = () => (
  <svg
    viewBox="0 0 180 28"
    className={`${LOGO_HEIGHT} w-auto`}
    aria-label="NextSpark AI"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle cx="11" cy="14" r="3.2" fill="currentColor" />
    <circle
      cx="11"
      cy="14"
      r="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      opacity="0.55"
    />
    <text
      x="26"
      y="20"
      fill="currentColor"
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize="17"
      fontWeight="500"
      letterSpacing="0.5"
    >
      NextSpark AI
    </text>
  </svg>
);

export const PartnersBar = () => {
  return (
    <footer className="bg-ink text-cream/70 py-14 border-t border-ink-border">
      <div className="container">
        <p className="text-center text-[11px] tracking-[0.3em] uppercase text-cream/45 mb-10 font-semibold">
          Nuestra Tecnología Potenciada Por
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 text-cream/65">
          <div className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <McmDigitalLogo />
          </div>
          <div className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <ValyTechLogo />
          </div>
          <div className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <AnthropicLogo />
          </div>
          <div className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <NextSparkLogo />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/45">
          <p className="font-serif-elegant italic">
            © {new Date().getFullYear()} Ohana Consultora Educativa
          </p>
          <p>Hecho con cariño para quienes enseñan ✦</p>
        </div>
      </div>
    </footer>
  );
};
