interface OhanaLogoProps {
  className?: string;
  showHeart?: boolean;
}

/**
 * OHANA Logo recreated in SVG.
 * - Hand-drawn organic display font for "OHANA"
 * - Elegant serif for "Consultora Educativa"
 * - Heart with fingerprint swirl below, with subtle hover pulse/glow
 */
export const OhanaLogo = ({ className = "", showHeart = true }: OhanaLogoProps) => {
  return (
    <div className={`flex flex-col items-center text-cream select-none ${className}`}>
      <h1 className="font-display text-7xl sm:text-8xl md:text-9xl leading-none tracking-wide drop-shadow-[0_2px_0_rgba(255,255,255,0.15)]">
        OHANA
      </h1>
      <p className="font-serif-elegant italic text-lg sm:text-xl md:text-2xl tracking-[0.18em] mt-2 opacity-95">
        Consultora Educativa
      </p>

      {showHeart && (
        <div className="mt-6 group cursor-default">
          <svg
            viewBox="0 0 120 110"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-heart-pulse transition-transform duration-500 group-hover:scale-110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Corazón con huella dactilar"
          >
            <defs>
              <clipPath id="heartClip">
                <path d="M60 100 C 20 75, 5 50, 5 30 C 5 14, 18 4, 32 4 C 44 4, 54 12, 60 22 C 66 12, 76 4, 88 4 C 102 4, 115 14, 115 30 C 115 50, 100 75, 60 100 Z" />
              </clipPath>
            </defs>

            {/* Soft heart fill */}
            <path
              d="M60 100 C 20 75, 5 50, 5 30 C 5 14, 18 4, 32 4 C 44 4, 54 12, 60 22 C 66 12, 76 4, 88 4 C 102 4, 115 14, 115 30 C 115 50, 100 75, 60 100 Z"
              fill="hsl(var(--cream) / 0.12)"
              stroke="hsl(var(--cream))"
              strokeWidth="1.2"
            />

            {/* Fingerprint swirls clipped to heart */}
            <g clipPath="url(#heartClip)" stroke="hsl(var(--cream))" strokeWidth="1.4" fill="none" strokeLinecap="round">
              <ellipse cx="60" cy="50" rx="6" ry="4" />
              <ellipse cx="60" cy="50" rx="14" ry="10" />
              <ellipse cx="60" cy="50" rx="22" ry="17" />
              <ellipse cx="60" cy="50" rx="30" ry="24" />
              <ellipse cx="60" cy="50" rx="38" ry="31" />
              <ellipse cx="60" cy="50" rx="46" ry="38" />
              <path d="M22 70 Q 40 78, 60 76 T 98 70" />
              <path d="M18 60 Q 40 68, 60 66 T 102 60" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
