import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Crown, Zap, BookOpen, Clock, Calendar,
  ChevronRight, Lock, Sparkles, ArrowLeft,
  RefreshCw, GraduationCap
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────
const N8N_BASE = "https://n8n.valy.agency/webhook";

// ─── Types ────────────────────────────────────────────────────────
interface Perfil {
  plan: string;
  limite: number;
  cuotaHoy: number;
  creditosRestantesHoy: number;
  creditosBienvenida: number | null;
  usandoBienvenida: boolean;
  nombre: string;
  apellido: string;
  email: string;
  imagen: string;
  vencimiento: string | null;
  miembro_desde: number | null;
}

interface Planificacion {
  id: string;
  fecha: string;
  materia: string;
  grado: string;
  tema: string;
  contenido: string | null;
  tipo: string;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────
const PLAN_CONFIG: Record<string, { label: string; color: string; badge: string; limite: number }> = {
  free:    { label: "Free",        color: "text-cream/50",  badge: "bg-cream/10 text-cream/50 border-cream/15",         limite: 1  },
  starter: { label: "Pro Básico",  color: "text-blue-400",  badge: "bg-blue-500/15 text-blue-300 border-blue-500/25",   limite: 5  },
  pro:     { label: "Pro Starter", color: "text-amber-400", badge: "bg-amber-500/15 text-amber-300 border-amber-500/25", limite: 10 },
};

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

// ─── Page ─────────────────────────────────────────────────────────
export const MiCuenta = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [historial, setHistorial] = useState<Planificacion[]>([]);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [planifSeleccionada, setPlanifSeleccionada] = useState<Planificacion | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { navigate("/"); return; }
    cargarDatos();
  }, [isLoaded]);

  const cargarDatos = async () => {
    if (!user?.id) return;
    setLoadingPerfil(true);
    setLoadingHistorial(true);

    try {
      const [perfilRes, historialRes] = await Promise.all([
        fetch(`${N8N_BASE}/ohana-usuario-perfil`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }),
        fetch(`${N8N_BASE}/ohana-usuario-historial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }),
      ]);

      const perfilData = await perfilRes.json();
      const p = Array.isArray(perfilData) ? perfilData[0] : perfilData;
      setPerfil(p);
      setLoadingPerfil(false);

      let historialData = [];
      try {
        const text = await historialRes.text();
        historialData = text ? JSON.parse(text) : [];
      } catch {
        historialData = [];
      }
      setHistorial(historialData);
      setLoadingHistorial(false);

    } catch {
      setLoadingPerfil(false);
      setLoadingHistorial(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  const planInfo = PLAN_CONFIG[perfil?.plan ?? "free"] ?? PLAN_CONFIG.free;
  const esFree = !perfil?.plan || perfil.plan === "free";
  const nombreMostrar = perfil?.nombre || user.firstName || user.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Docente";

  return (
    <div className="min-h-screen bg-ink text-cream">

      {/* Header */}
      <header className="border-b border-ink-border bg-ink/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-cream/50 hover:text-cream transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="font-display text-sm tracking-wide">OHANA</span>
          </div>
          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* ── Perfil ──────────────────────────────────────────── */}
        <div className="bg-ink-soft border border-ink-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="" className="w-14 h-14 rounded-full ring-2 ring-coral/30 object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center">
                <span className="text-coral text-xl font-bold">{nombreMostrar[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-cream font-display text-xl">{nombreMostrar}</h1>
              <p className="text-cream/40 text-sm truncate">{perfil?.email ?? user.emailAddresses?.[0]?.emailAddress}</p>
              {!loadingPerfil && perfil && (
                <span className={`inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${planInfo.badge}`}>
                  {perfil.plan === "free" ? <Zap className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                  {planInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Créditos ─────────────────────────────────────────── */}
        {loadingPerfil ? (
          <SkeletonCard />
        ) : perfil ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Restantes hoy */}
            {perfil.usandoBienvenida ? (
              <CreditCard
                label="Planificaciones de bienvenida"
                value={perfil.creditosBienvenida ?? 0}
                total={5}
                icon={<Zap className="w-4 h-4" />}
                color={(perfil.creditosBienvenida ?? 0) === 0 ? "text-red-400" : "text-amber-400"}
              />
            ) : (
              <CreditCard
                label={`Disponibles hoy (${perfil.limite}/día)`}
                value={perfil.creditosRestantesHoy}
                total={perfil.limite}
                icon={<Sparkles className="w-4 h-4" />}
                color={perfil.creditosRestantesHoy === 0 ? "text-red-400" : "text-emerald-400"}
              />
            )}

            {/* Total generadas — viene del historial */}
            <div className="bg-ink-soft border border-ink-border rounded-2xl px-5 py-4">
              <div className="text-coral/70 mb-3"><BookOpen className="w-4 h-4" /></div>
              <p className="text-cream text-2xl font-display">
                {loadingHistorial ? "—" : historial.length}
              </p>
              <p className="text-cream/40 text-xs font-semibold uppercase tracking-widest mt-0.5">Planificaciones generadas</p>
            </div>

            {/* Vencimiento o miembro desde */}
            <div className="bg-ink-soft border border-ink-border rounded-2xl px-5 py-4">
              <div className="text-cream/40 mb-3"><Calendar className="w-4 h-4" /></div>
              {perfil.vencimiento ? (
                <>
                  <p className="text-cream text-lg font-display leading-tight">
                    {new Date(perfil.vencimiento).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-cream/40 text-xs font-semibold uppercase tracking-widest mt-0.5">Vencimiento del plan</p>
                </>
              ) : (
                <>
                  <p className="text-cream text-lg font-display leading-tight">
                    {perfil.miembro_desde
                      ? new Date(perfil.miembro_desde).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </p>
                  <p className="text-cream/40 text-xs font-semibold uppercase tracking-widest mt-0.5">Miembro desde</p>
                </>
              )}
            </div>

          </div>
        ) : null}

        {/* ── Upsell free — solo si no tiene créditos de bienvenida ── */}
        {!loadingPerfil && esFree && !perfil?.usandoBienvenida && (
          <div className="bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-500/25 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-amber-300 font-semibold text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" /> Pasate a Pro
              </p>
              <p className="text-amber-200/60 text-xs mt-0.5">
                Hasta 10 planificaciones por día, contexto de aula y descarga en PDF
              </p>
            </div>
            <button onClick={() => navigate("/precios")} className="shrink-0 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-4 py-2 rounded-xl transition-colors">
              Ver planes
            </button>
          </div>
        )}

        {/* ── Historial ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-cream">Mis planificaciones</h2>
            <button
              onClick={cargarDatos}
              className="text-cream/30 hover:text-cream/70 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loadingHistorial ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-ink-soft border border-ink-border rounded-xl h-16 animate-pulse" />
              ))}
            </div>
          ) : historial.length === 0 ? (
            <div className="bg-ink-soft border border-ink-border rounded-2xl py-14 text-center text-cream/30 text-sm">
              <GraduationCap className="w-8 h-8 mx-auto mb-3 text-cream/15" />
              Todavía no generaste ninguna planificación
            </div>
          ) : (
            <div className="space-y-2">
              {historial.map((p, i) => (
                <PlanificacionRow
                  key={p.id}
                  planif={p}
                  esFree={esFree}
                  index={i}
                  onClick={() => { if (esFree) { const m = document.getElementById('upsell-modal'); if(m) m.style.display='flex'; } else setPlanifSeleccionada(p); }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Modal upsell historial bloqueado ─────────────────── */}
      {esFree && !perfil?.usandoBienvenida && (
        <div id="upsell-modal" style={{display: "none"}}
          className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) (e.currentTarget as HTMLElement).style.display = "none"; }}
        >
          <div className="bg-ink-soft border border-amber-500/30 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-cream font-display text-lg mb-2">Disponible en Pro</h3>
            <p className="text-cream/50 text-sm mb-5">
              Con Pro podés ver y descargar todas tus planificaciones guardadas, hasta 10 por día.
            </p>
            <button
              onClick={() => { const m = document.getElementById("upsell-modal"); if(m) m.style.display="none"; navigate("/precios"); }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              Ver planes
            </button>
            <button
              onClick={() => { const m = document.getElementById("upsell-modal"); if(m) m.style.display="none"; }}
              className="w-full text-cream/30 hover:text-cream/60 text-xs mt-3 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal de planificación ────────────────────────────── */}
      {planifSeleccionada && (
        <div
          className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setPlanifSeleccionada(null)}
        >
          <div
            className="bg-ink-soft border border-ink-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-ink-soft border-b border-ink-border px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-cream font-semibold">{planifSeleccionada.materia}</p>
                <p className="text-cream/40 text-xs">{planifSeleccionada.grado} · {formatFecha(planifSeleccionada.created_at)}</p>
              </div>
              <button
                onClick={() => setPlanifSeleccionada(null)}
                className="text-cream/40 hover:text-cream transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
            <div className="px-6 py-5">
              <pre className="text-cream/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {planifSeleccionada.contenido ?? "Contenido no disponible"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Fila historial ───────────────────────────────────────────────
const PlanificacionRow = ({
  planif, esFree, index, onClick
}: {
  planif: Planificacion;
  esFree: boolean;
  index: number;
  onClick: () => void;
}) => {
  const bloqueada = esFree;

  return (
    <div
      onClick={onClick}
      className={`relative group bg-ink-soft border border-ink-border rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all ${
        bloqueada
          ? "hover:border-amber-500/20 hover:bg-amber-500/5 cursor-pointer"
          : "hover:border-cream/20 hover:bg-cream/3 cursor-pointer"
      }`}
    >
      {/* Icono materia */}
      <div className="w-9 h-9 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
        <GraduationCap className="w-4 h-4 text-coral/60" />
      </div>

      {/* Info */}
      <div className={`flex-1 min-w-0 ${bloqueada ? "blur-[3px] select-none" : ""}`}>
        <p className="text-cream text-sm font-medium truncate">{planif.tema || planif.materia}</p>
        <p className="text-cream/40 text-xs flex items-center gap-2 mt-0.5">
          <span>{planif.materia}</span>
          <span>·</span>
          <span>{planif.grado}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatFecha(planif.created_at)}
          </span>
        </p>
      </div>

      {/* Badge tipo */}
      {!bloqueada && (
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${
          planif.tipo === "pro" || planif.tipo === "starter"
            ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
            : "bg-cream/10 text-cream/40 border-cream/15"
        }`}>
          {planif.tipo === "free" ? "Free" : "Pro"}
        </span>
      )}

      {/* Lock overlay */}
      {bloqueada && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-end pr-4">
          <div className="flex items-center gap-1.5 bg-ink-soft/90 border border-amber-500/30 text-amber-400/80 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Lock className="w-3 h-3" />
            Disponible en Pro
          </div>
        </div>
      )}

      {/* Arrow */}
      {!bloqueada && (
        <ChevronRight className="w-4 h-4 text-cream/20 group-hover:text-cream/50 transition-colors shrink-0" />
      )}
    </div>
  );
};

// ─── Credit card ──────────────────────────────────────────────────
const CreditCard = ({ label, value, total, icon, color }: {
  label: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-ink-soft border border-ink-border rounded-2xl px-5 py-4">
    <div className={`${color} mb-3`}>{icon}</div>
    <p className={`text-2xl font-display ${color}`}>
      {value}
      <span className="text-cream/20 text-base font-sans ml-1">/ {total}</span>
    </p>
    <p className="text-cream/40 text-xs font-semibold uppercase tracking-widest mt-0.5">{label}</p>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-ink-soft border border-ink-border rounded-2xl h-24 animate-pulse" />
    ))}
  </div>
);