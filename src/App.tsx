import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { OhanaLayout } from "./layouts/OhanaLayout";
import { PlanificadorLayout } from "./layouts/PlanificadorLayout";

// Home institucional
import { Home } from "./pages/Home";

// Planificador (rutas existentes — solo cambia el path)
import Index from "./pages/Index";
import { Precios } from "./pages/Precios";
import { MiCuenta } from "./pages/MiCuenta";
import { Admin } from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Productos próximamente
import { Rubricas } from "./pages/productos/Rubricas";
import { Devoluciones } from "./pages/productos/Devoluciones";
import { ActosEscolares } from "./pages/productos/ActosEscolares";
import { Presentaciones } from "./pages/productos/Presentaciones";
import { ACI } from "./pages/productos/ACI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* ── Home institucional Ohana ─────────────────────── */}
          <Route element={<OhanaLayout />}>
            <Route path="/" element={<Home />} />

            {/* Productos próximamente */}
            <Route path="/producto/rubricas" element={<Rubricas />} />
            <Route path="/producto/devoluciones" element={<Devoluciones />} />
            <Route path="/producto/actos-escolares" element={<ActosEscolares />} />
            <Route path="/producto/presentaciones" element={<Presentaciones />} />
            <Route path="/producto/aci" element={<ACI />} />
          </Route>

          {/* ── Planificador ─────────────────────────────────── */}
          <Route path="/planificador" element={<PlanificadorLayout />}>
            <Route index element={<Index />} />
            <Route path="precios" element={<Precios />} />
            <Route path="cuenta" element={<MiCuenta />} />
            <Route path="admin" element={<Admin />} />
          </Route>

          {/* ── Redirects legacy ─────────────────────────────── */}
          <Route path="/precios" element={<Navigate to="/planificador/precios" replace />} />
          <Route path="/micuenta" element={<Navigate to="/planificador/cuenta" replace />} />
          <Route path="/admin" element={<Navigate to="/planificador/admin" replace />} />

          {/* ── 404 ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;