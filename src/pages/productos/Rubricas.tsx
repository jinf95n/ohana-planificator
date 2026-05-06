import { ProductoProximamente } from "@/components/ProductoProximamente";

export const Rubricas = () => (
  <ProductoProximamente config={{
    id: "rubricas",
    nombre: "Rúbricas y evaluaciones",
    tagline: "Evaluá con criterios claros y justos.",
    descripcion: "Crear una rúbrica que sea justa, clara y útil lleva tiempo que no siempre tenés. Ohana la genera en segundos, alineada a tu planificación y adaptada al nivel de tus alumnos.",
    paraQuien: [
      "Docentes que quieren evaluar con criterios claros y comunicarlos antes de la actividad.",
      "Quienes necesitan instrumentos de evaluación para presentar a dirección o supervisión.",
      "Docentes que buscan coherencia entre lo que enseñan y cómo evalúan.",
    ],
    features: [
      "Rúbricas analíticas con niveles de desempeño claros y descriptores concretos.",
      "Generación automática desde tu planificación — sin empezar de cero.",
      "Exámenes y guías de trabajo listos para imprimir o compartir digitalmente.",
      "Adaptadas al nivel educativo: inicial, primaria, secundaria o superior.",
    ],
  }} />
);