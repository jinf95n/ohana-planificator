import { useNavigate, Outlet } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Sparkles, Instagram, Facebook } from "lucide-react";

export const OhanaLayout = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar institucional */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-soft">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral to-amber-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display text-lg text-ink tracking-wide">OHANA</span>
            <span className="text-ink/40 text-xs font-medium hidden sm:block">Consultora Educativa</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById("productos");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-ink/60 hover:text-ink text-sm font-medium transition-colors hidden sm:block"
            >
              Productos
            </button>
            <button
              onClick={() => isSignedIn ? navigate("/planificador") : openSignIn()}
              className="flex items-center gap-2 bg-coral text-cream text-sm font-semibold px-4 py-2 rounded-xl hover:bg-coral/90 transition-all shadow-sm"
            >
              {isSignedIn ? "Ir al planificador" : "Ingresar"}
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer institucional */}
      <OhanaFooter />
    </div>
  );
};

const OhanaFooter = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-ink text-cream py-12 border-t border-ink-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral to-amber-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg text-cream">OHANA</span>
              <p className="text-cream/40 text-xs">Consultora Educativa</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/ohanaconsultora/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/40 hover:text-cream transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/ohanaconsultoraeducativa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/40 hover:text-cream transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/35">
          <p className="font-serif-elegant italic">© {new Date().getFullYear()} Ohana Consultora Educativa</p>
          <p>Hecho con cariño para quienes enseñan ✦</p>
        </div>
      </div>
    </footer>
  );
};