import { Outlet } from "react-router-dom";

// El planificador mantiene su propio Navbar y footer (PartnersBar)
// Este layout es un pass-through para agrupar rutas bajo /planificador
export const PlanificadorLayout = () => {
  return <Outlet />;
};