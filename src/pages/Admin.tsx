import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Crown, Users, Sparkles, RefreshCw, Shield,
  TrendingUp, Calendar, ChevronDown, LogOut,
  CheckCircle2, XCircle, Clock, Search
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────
const ADMIN_EMAILS = ["jinf95n@gmail.com"];
// URL base explícita — no depende de string replace
const N8N_BASE = "https://n8n.valy.agency/webhook";

const PLANES = [
  { value: "free",    label: "Free",       color: "bg-ink/40 text-cream/60",  badge: "bg-cream/10 text-cream/50" },
  { value: "starter", label: "Pro Básico", color: "bg-blue-900 text-blue-200", badge: "bg-blue-500/20 text-blue-300" },
  { value: "pro",     label: "Pro Starter",color: "bg-amber-900 text-amber-200", badge: "bg-amber-500/20 text-amber-300" },
];

interface OhanaUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image_url: string;
  plan: string;
  created_at: number;
  last_sign_in_at: number;
}

// ─── Servicio ─────────────────────────────────────────────────────
async function fetchUsers(): Promise<OhanaUser[]> {
  const res = await fetch(`${N8N_BASE}/ohana-admin-users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "list" }),
  });
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

  const raw = await res.text();
  console.log("[Ohana Admin] Raw:", raw.slice(0, 200));

  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error("Respuesta no es JSON válido"); }

  // n8n puede devolver: array directo, {users:[...]}, o un solo objeto
  let list: any[] = [];
  if (Array.isArray(data)) {
    list = data;
  } else if (Array.isArray(data?.users)) {
    list = data.users;
  } else if (data?.id) {
    list = [data]; // n8n devolvió el primer item solo
  } else {
    console.warn("[Ohana Admin] Forma inesperada:", data);
  }

  return list
    .filter((u: any) => u?.id)
    .map((u: any) => ({
      id: u.id,
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      email: u.email_addresses?.[0]?.email_address ?? "",
      image_url: u.image_url ?? "",
      plan: u.public_metadata?.plan ?? "free",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));
}

async function updatePlan(userId: string, plan: string): Promise<void> {
  const res = await fetch(`${N8N_BASE}/ohana-admin-update-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, plan }),
  });
  if (!res.ok) throw new Error("Error al actualizar plan");
}

// ─── Componente ───────────────────────────────────────────────────
export const Admin = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<OhanaUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const isAdmin = ADMIN_EMAILS.includes(
    user?.emailAddresses?.[0]?.emailAddress ?? ""
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) {
      navigate("/");
      return;
    }
    cargarUsuarios();
  }, [isLoaded]);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (userId: string, plan: string) => {
    setUpdating(userId);
    try {
      await updatePlan(userId, plan);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan } : u))
      );
      showToast("Plan actualizado ✓", true);
    } catch (e: any) {
      showToast("Error al actualizar", false);
    } finally {
      setUpdating(null);
    }
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const filtrados = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
    );
  });

  // Stats
  const totalFree = users.filter((u) => !u.plan || u.plan === "free").length;
  const totalStarter = users.filter((u) => u.plan === "starter").length;
  const totalPro = users.filter((u) => u.plan === "pro").length;

  if (!isLoaded) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-ink text-cream font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${toast.ok ? "bg-emerald-900 text-emerald-200 border border-emerald-700" : "bg-red-900 text-red-200 border border-red-700"}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-ink-border bg-ink-soft/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-coral flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cream" />
            </div>
            <div>
              <span className="font-display text-xl text-cream">OHANA</span>
              <span className="ml-2 text-xs text-cream/40 font-semibold tracking-widest uppercase">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-cream/5 border border-cream/10 rounded-full px-3 py-1.5">
              <Shield className="w-3.5 h-3.5 text-coral" />
              <span className="text-xs text-cream/60">{user?.emailAddresses?.[0]?.emailAddress}</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-cream/40 hover:text-cream transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total usuarios" value={users.length} icon={<Users className="w-5 h-5" />} color="text-cream" />
          <StatCard label="Free" value={totalFree} icon={<Clock className="w-5 h-5" />} color="text-cream/50" />
          <StatCard label="Pro Básico" value={totalStarter} icon={<TrendingUp className="w-5 h-5" />} color="text-blue-400" />
          <StatCard label="Pro Starter" value={totalPro} icon={<Crown className="w-5 h-5" />} color="text-amber-400" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ink-soft border border-ink-border text-cream placeholder:text-cream/25 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/30 transition-all text-sm"
            />
          </div>
          <button
            onClick={cargarUsuarios}
            disabled={loading}
            className="flex items-center gap-2 bg-cream/5 hover:bg-cream/10 border border-ink-border text-cream/70 hover:text-cream px-4 py-2.5 rounded-xl text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-ink-soft border border-ink-border rounded-2xl overflow-hidden">
          {/* Cabecera */}
          <div className="grid grid-cols-[1fr_1fr_120px_140px] gap-4 px-6 py-3 border-b border-ink-border bg-ink/40">
            <span className="text-cream/40 text-xs font-semibold uppercase tracking-widest">Usuario</span>
            <span className="text-cream/40 text-xs font-semibold uppercase tracking-widest">Email</span>
            <span className="text-cream/40 text-xs font-semibold uppercase tracking-widest">Plan actual</span>
            <span className="text-cream/40 text-xs font-semibold uppercase tracking-widest">Cambiar plan</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-cream/30 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-3 text-cream/20" />
              Cargando usuarios...
            </div>
          ) : filtrados.length === 0 ? (
            <div className="py-16 text-center text-cream/30 text-sm">
              {search ? "No hay usuarios que coincidan." : "No hay usuarios registrados."}
            </div>
          ) : (
            filtrados.map((u, i) => (
              <UserRow
                key={u.id}
                user={u}
                onPlanChange={handlePlanChange}
                updating={updating === u.id}
                isLast={i === filtrados.length - 1}
              />
            ))
          )}
        </div>

        <p className="text-center text-cream/20 text-xs mt-6">
          {filtrados.length} de {users.length} usuarios · Ohana Admin
        </p>
      </main>
    </div>
  );
};

// ─── Fila de usuario ──────────────────────────────────────────────
const UserRow = ({
  user, onPlanChange, updating, isLast
}: {
  user: OhanaUser;
  onPlanChange: (id: string, plan: string) => void;
  updating: boolean;
  isLast: boolean;
}) => {
  const planInfo = PLANES.find((p) => p.value === user.plan) ?? PLANES[0];
  const nombre = `${user.first_name} ${user.last_name}`.trim() || "Sin nombre";
  const fecha = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })
    : "—";

  return (
    <div className={`grid grid-cols-[1fr_1fr_120px_140px] gap-4 items-center px-6 py-4 hover:bg-cream/3 transition-colors ${!isLast ? "border-b border-ink-border/50" : ""}`}>

      {/* Usuario */}
      <div className="flex items-center gap-3 min-w-0">
        {user.image_url ? (
          <img src={user.image_url} alt="" className="w-8 h-8 rounded-full shrink-0 object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center shrink-0">
            <span className="text-coral text-xs font-bold">{nombre[0]}</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-cream text-sm font-medium truncate">{nombre}</p>
          <p className="text-cream/35 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {fecha}
          </p>
        </div>
      </div>

      {/* Email */}
      <p className="text-cream/55 text-sm truncate">{user.email}</p>

      {/* Plan actual */}
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${planInfo.badge}`}>
        {user.plan === "pro" && <Crown className="w-3 h-3" />}
        {planInfo.label}
      </span>

      {/* Selector de plan */}
      <div className="relative">
        <select
          value={user.plan}
          onChange={(e) => onPlanChange(user.id, e.target.value)}
          disabled={updating}
          className={`w-full appearance-none bg-ink border border-ink-border text-cream text-sm rounded-lg px-3 py-1.5 pr-7 outline-none focus:border-coral/50 cursor-pointer transition-all ${updating ? "opacity-50 cursor-wait" : "hover:border-coral/30"}`}
        >
          {PLANES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {updating ? (
          <RefreshCw className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/40 animate-spin pointer-events-none" />
        ) : (
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/40 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color }: {
  label: string; value: number; icon: React.ReactNode; color: string;
}) => (
  <div className="bg-ink-soft border border-ink-border rounded-2xl px-5 py-4">
    <div className={`${color} mb-3`}>{icon}</div>
    <p className="text-cream text-2xl font-display">{value}</p>
    <p className="text-cream/40 text-xs font-semibold uppercase tracking-widest mt-0.5">{label}</p>
  </div>
);