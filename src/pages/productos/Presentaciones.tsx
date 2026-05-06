import { ProductoProximamente } from "@/components/ProductoProximamente";

export const Presentaciones = () => (
  <ProductoProximamente config={{
    id: "presentaciones",
    nombre: "Presentaciones para el aula",
    tagline: "Diapositivas listas para proyectar.",
    descripcion: "Hacer una presentación visual que realmente acompañe la clase lleva tiempo. Ohana genera la estructura, el contenido y las ideas visuales para que solo tengas que proyectar.",
    paraQuien: [
      "Docentes que usan proyector o pizarra digital y necesitan apoyo visual para sus clases.",
      "Quienes quieren presentaciones claras y atractivas sin ser diseñadores.",
      "Docentes que quieren que el contenido visual sea coherente con su planificación.",
    ],
    features: [
      "Estructura de presentación generada desde tu planificación, lista para usar.",
      "Contenido dividido por momentos: inicio, desarrollo y cierre.",
      "Sugerencias visuales y de actividades para cada diapositiva.",
      "Exportable a PowerPoint o Google Slides para editar como necesites.",
    ],
  }} />
);