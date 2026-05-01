const LOGO_HEIGHT = "h-9";

const McmDigitalLogo = () => (
  <img src="/logos/mcm-digital.png" alt="MCM Digital" className={`${LOGO_HEIGHT} w-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-300`} style={{ filter: "brightness(0) invert(1)" }} />
);

const ValyLogo = () => (
  <img src="/logos/valy-agency.png" alt="Valy Agency" className={`${LOGO_HEIGHT} w-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-300`} style={{ filter: "brightness(0) invert(1)" }} />
);

const Landing24Logo = () => (
  <img src="/logos/landing24.png" alt="Landing24" className={`${LOGO_HEIGHT} w-auto object-contain opacity-50 hover:opacity-80 transition-opacity duration-300`} style={{ filter: "brightness(0) invert(1)" }} />
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