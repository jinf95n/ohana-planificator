import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, Shield, LogOut, Crown } from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["jinf95n@gmail.com"]; // ← tu email

// ─── OhanaLogo (inline para no depender de imports externos) ───────
const OhanaLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-coral to-amber-500 flex items-center justify-center shadow-sm">
      <Sparkles className="w-3.5 h-3.5 text-white" />
    </div>
    <span className="font-display text-lg text-cream tracking-wide">OHANA</span>
  </div>
);

// ─── Props ─────────────────────────────────────────────────────────
interface NavbarProps {
  onLogin?: () => void;
}

// ─── Navbar ────────────────────────────────────────────────────────
export const Navbar = ({ onLogin }: NavbarProps) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = ADMIN_EMAILS.includes(
    user?.emailAddresses?.[0]?.emailAddress ?? ""
  );

  const plan = (user?.publicMetadata?.plan as string) ?? "free";
  const planLabel =
    plan === "pro" ? "Pro Starter" : plan === "starter" ? "Pro Básico" : null;

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    signOut();
    setOpen(false);
  };

  const handleAdmin = () => {
    navigate("/admin");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-ink-border bg-ink/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
          <OhanaLogo />
        </button>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-cream/10 animate-pulse" />
          ) : !isSignedIn ? (
            <button
              onClick={() => (onLogin ? onLogin() : openSignIn())}
              className="flex items-center gap-2 bg-coral text-cream text-sm font-semibold px-4 py-2 rounded-xl hover:bg-coral/90 transition-all shadow-sm"
            >
              Iniciar sesión
            </button>
          ) : (
            /* Usuario logueado → dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2.5 bg-cream/5 hover:bg-cream/10 border border-ink-border hover:border-cream/20 rounded-xl px-3 py-2 transition-all group"
              >
                {/* Avatar */}
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-cream/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-coral/30 flex items-center justify-center">
                    <span className="text-coral text-xs font-bold">
                      {user.firstName?.[0] ?? user.emailAddresses?.[0]?.emailAddress?.[0] ?? "?"}
                    </span>
                  </div>
                )}

                {/* Nombre */}
                <span className="text-cream text-sm font-medium max-w-[120px] truncate hidden sm:block">
                  {user.firstName ?? user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                </span>

                {/* Badge plan */}
                {planLabel && (
                  <span className="hidden sm:flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                    <Crown className="w-2.5 h-2.5" />
                    {planLabel}
                  </span>
                )}

                <ChevronDown
                  className={`w-3.5 h-3.5 text-cream/40 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-ink-soft border border-ink-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                  {/* Info usuario */}
                  <div className="px-4 py-3.5 border-b border-ink-border">
                    <p className="text-cream text-sm font-semibold truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName ?? "Mi cuenta"}
                    </p>
                    <p className="text-cream/40 text-xs truncate mt-0.5">
                      {user.emailAddresses?.[0]?.emailAddress}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        planLabel
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-cream/10 text-cream/40"
                      }`}>
                        {planLabel ? <><Crown className="w-2.5 h-2.5" />{planLabel}</> : "Plan Free"}
                      </span>
                    </div>
                  </div>

                  {/* Opciones */}
                  <div className="py-1.5">

                    {/* Admin — solo si sos admin */}
                    {isAdmin && (
                      <button
                        onClick={handleAdmin}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-coral hover:bg-coral/10 transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Panel de administración
                      </button>
                    )}

                    {/* Logout */}
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