/**
 * Subtle, elegant tech-partner bar.
 * Custom minimalist SVG wordmarks for MCM Digital and Valy Tech.
 * Anthropic uses a clean text mark with its asterisk-style glyph.
 */

const McmDigitalLogo = () => (
  <svg viewBox="0 0 160 32" className="h-6 w-auto" aria-label="MCM Digital">
    <g fill="currentColor">
      {/* M */}
      <path d="M2 24V8h3l5 9 5-9h3v16h-2.5V13.5L11 22h-2L4.5 13.5V24z" />
      {/* C */}
      <path d="M22 16c0-4.5 3.3-8.2 8-8.2 2.4 0 4.4.9 5.7 2.3l-1.7 1.8c-1-1-2.3-1.6-4-1.6-3.2 0-5.5 2.6-5.5 5.7s2.3 5.7 5.5 5.7c1.7 0 3-.6 4-1.6l1.7 1.8c-1.3 1.4-3.3 2.3-5.7 2.3-4.7 0-8-3.7-8-8.2z" />
      {/* M */}
      <path d="M40 24V8h3l5 9 5-9h3v16h-2.5V13.5L49 22h-2l-4.5-8.5V24z" />
    </g>
    <g fill="currentColor" opacity="0.55">
      <text x="64" y="21" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="300" letterSpacing="2">DIGITAL</text>
    </g>
  </svg>
);

const ValyTechLogo = () => (
  <svg viewBox="0 0 150 32" className="h-6 w-auto" aria-label="Valy Tech">
    <g fill="currentColor">
      {/* Stylized V triangle mark */}
      <path d="M4 6 L14 26 L24 6 L20 6 L14 19 L8 6 Z" />
      <text x="28" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600" letterSpacing="0.5">valy</text>
    </g>
    <g fill="currentColor" opacity="0.55">
      <text x="68" y="22" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="300" letterSpacing="2">TECH</text>
    </g>
  </svg>
);

const AnthropicLogo = () => (
  <svg viewBox="0 0 170 32" className="h-6 w-auto" aria-label="Anthropic">
    <g fill="currentColor">
      {/* asterisk glyph */}
      <path d="M14 4 L17 13 L26 13 L18.5 18.5 L21.5 27 L14 21.5 L6.5 27 L9.5 18.5 L2 13 L11 13 Z" />
      <text x="32" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="500" letterSpacing="1">Anthropic</text>
    </g>
  </svg>
);

const NextSparkLogo = () => (
  <svg viewBox="0 0 160 32" className="h-6 w-auto" aria-label="NextSpark AI">
    <g fill="currentColor">
      <circle cx="12" cy="16" r="3" />
      <circle cx="12" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <text x="28" y="22" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="500" letterSpacing="1">NextSpark AI</text>
    </g>
  </svg>
);

export const PartnersBar = () => {
  return (
    <footer className="bg-ink text-cream/70 py-14 border-t border-ink-border">
      <div className="container">
        <p className="text-center text-[11px] tracking-[0.3em] uppercase text-cream/45 mb-8 font-semibold">
          Nuestra Tecnología Potenciada Por
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-cream/60">
          <div className="hover:text-cream transition-colors duration-300"><McmDigitalLogo /></div>
          <div className="hover:text-cream transition-colors duration-300"><ValyTechLogo /></div>
          <div className="hover:text-cream transition-colors duration-300"><AnthropicLogo /></div>
          <div className="hover:text-cream transition-colors duration-300"><NextSparkLogo /></div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/45">
          <p className="font-serif-elegant italic">© {new Date().getFullYear()} Ohana Consultora Educativa</p>
          <p>Hecho con cariño para quienes enseñan ✦</p>
        </div>
      </div>
    </footer>
  );
};
