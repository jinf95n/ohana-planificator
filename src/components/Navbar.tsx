import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, Shield, LogOut, Crown, User } from "lucide-react";

const ADMIN_EMAILS = ["jinf95n@gmail.com"];

const OhanaLogo = ({ dark = false }: { dark?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral to-amber-500 flex items-center justify-center shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-white" />
    </div>
    <span className={`font-display text-lg tracking-wide ${dark ? "text-ink" : "text-cream"}`}>OHANA</span>
  </div>
);

interface NavbarProps {
  onLogin?: () => void;
}

export const Navbar = ({ onLogin }: NavbarProps) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = ADMIN_EMAILS.includes(user?.emailAddresses?.[0]?.emailAddress ?? "");
  const plan = (user?.publicMetadata?.plan as string) ?? "free";
  const planLabel = plan === "pro" ? "Pro Starter" : plan === "starter" ? "Pro Básico" : null;

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { signOut(); setOpen(false); };
  const handleAdmin = () => { navigate("/admin"); setOpen(false); };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? "bg-ink/90 backdrop-blur-md border-b border-ink-border shadow-sm"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
          <OhanaLogo />
        </button>

        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-cream/10 animate-pulse" />
          ) : !isSignedIn ? (
            <button
              onClick={() => (onLogin ? onLogin() : openSignIn())}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm ${
                scrolled
                  ? "bg-coral text-cream hover:bg-coral/90"
                  : "bg-cream/15 text-cream hover:bg-cream/25 backdrop-blur-sm border border-cream/20"
              }`}
            >
              Iniciar sesión
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all group border ${
                  scrolled
                    ? "bg-cream/5 hover:bg-cream/10 border-ink-border hover:border-cream/20"
                    : "bg-cream/10 hover:bg-cream/20 border-cream/15 hover:border-cream/30"
                }`}
              >
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-cream/20" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-coral/30 flex items-center justify-center">
                    <span className="text-coral text-xs font-bold">
                      {user.firstName?.[0] ?? user.emailAddresses?.[0]?.emailAddress?.[0] ?? "?"}
                    </span>
                  </div>
                )}

                <span className="text-cream text-sm font-medium max-w-[120px] truncate hidden sm:block">
                  {user.firstName ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                </span>

                {planLabel && (
                  <span className="hidden sm:flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                    <Crown className="w-2.5 h-2.5" />
                    {planLabel}
                  </span>
                )}

                <ChevronDown className={`w-3.5 h-3.5 text-cream/40 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-ink-soft border border-ink-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3.5 border-b border-ink-border">
                    <p className="text-cream text-sm font-semibold truncate">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName ?? "Mi cuenta"}
                    </p>
                    <p className="text-cream/40 text-xs truncate mt-0.5">
                      {user.emailAddresses?.[0]?.emailAddress}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        planLabel ? "bg-amber-500/15 text-amber-400" : "bg-cream/10 text-cream/40"
                      }`}>
                        {planLabel ? <><Crown className="w-2.5 h-2.5" />{planLabel}</> : "Plan Free"}
                      </span>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <button
                      onClick={() => { navigate("/micuenta"); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-cream/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi cuenta
                    </button>

                    {isAdmin && (
                      <button
                        onClick={handleAdmin}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-coral hover:bg-coral/10 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Panel de administración
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cream/60 hover:text-cream hover:bg-cream/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};