const LOGO_HEIGHT = "h-7";

const McmDigitalLogo = () => (
  <svg viewBox="0 0 180 28" className={`${LOGO_HEIGHT} w-auto`} aria-label="MCM Digital" preserveAspectRatio="xMidYMid meet">
    <text x="0" y="20" fill="currentColor" fontFamily="'Inter', system-ui, sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5">MCM</text>
    <text x="56" y="20" fill="currentColor" opacity="0.55" fontFamily="'Inter', system-ui, sans-serif" fontSize="14" fontWeight="300" letterSpacing="3">DIGITAL</text>
  </svg>
);

const ValyLogo = () => (
  <svg viewBox="0 0 160 28" className={`${LOGO_HEIGHT} w-auto`} aria-label="Valy Agency" preserveAspectRatio="xMidYMid meet">
    <path d="M2 6 L10 22 L18 6 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <text x="24" y="20" fill="currentColor" fontFamily="'Inter', system-ui, sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5">valy</text>
    <text x="68" y="20" fill="currentColor" opacity="0.55" fontFamily="'Inter', system-ui, sans-serif" fontSize="14" fontWeight="300" letterSpacing="3">AGENCY</text>
  </svg>
);

const Landing24Logo = () => (
  <svg viewBox="0 0 190 28" className={`${LOGO_HEIGHT} w-auto`} aria-label="Landing24" preserveAspectRatio="xMidYMid meet">
    {/* rocket shape */}
    <path d="M6 20 L10 8 L14 20 M8 16 L12 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="22" y="20" fill="currentColor" fontFamily="'Inter', system-ui, sans-serif" fontSize="17" fontWeight="600" letterSpacing="0.3">Landing</text>
    <text x="110" y="20" fill="currentColor" opacity="0.7" fontFamily="'Inter', system-ui, sans-serif" fontSize="17" fontWeight="800" letterSpacing="0.3">24</text>
  </svg>
);

export const PartnersBar = () => {
  return (
    <footer className="bg-ink text-cream/70 py-14 border-t border-ink-border">
      <div className="container">
        <p className="text-center text-[11px] tracking-[0.3em] uppercase text-cream/45 mb-10 font-semibold">
          Desarrollado por
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 text-cream/55">
          <a href="https://mcmdigital.com.ar" target="_blank" rel="noopener noreferrer"
            className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <McmDigitalLogo />
          </a>
          <a href="https://valy.agency" target="_blank" rel="noopener noreferrer"
            className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <ValyLogo />
          </a>
          <a href="https://landing24.com.ar" target="_blank" rel="noopener noreferrer"
            className="flex items-center h-7 hover:text-cream transition-colors duration-300">
            <Landing24Logo />
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/45">
          <p className="font-serif-elegant italic">
            © {new Date().getFullYear()} Ohana Consultora Educativa
          </p>
          <div className="flex items-center gap-4">
            <a href="/precios" className="hover:text-cream/70 transition-colors">Precios</a>
            <span>·</span>
            <a href="/micuenta" className="hover:text-cream/70 transition-colors">Mi cuenta</a>
            <span>·</span>
            <p>Hecho con cariño para quienes enseñan ✦</p>
          </div>
        </div>
      </div>
    </footer>
  );
};