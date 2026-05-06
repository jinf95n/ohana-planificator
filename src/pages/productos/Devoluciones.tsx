import { ProductoProximamente } from "@/components/ProductoProximamente";

export const Devoluciones = () => (
  <ProductoProximamente config={{
    id: "devoluciones",
    nombre: "Devoluciones a alumnos",
    tagline: "Retroalimentación que realmente ayuda.",
    descripcion: "Escribir devoluciones personalizadas para cada alumno es una de las tareas más importantes y más postergadas. Ohana te ayuda a redactarlas de forma rápida, empática y pedagógicamente sólida.",
    paraQuien: [
      "Docentes con grupos numerosos que necesitan devolver trabajos con comentarios útiles.",
      "Quienes quieren que sus devoluciones motiven y orienten, no solo corrijan.",
      "Docentes que trabajan con diversidad y necesitan adaptar el mensaje a cada alumno.",
    ],
    features: [
      "Devoluciones personalizadas según el desempeño y el contexto del alumno.",
      "Tono positivo y constructivo — que el alumno sepa qué hizo bien y qué mejorar.",
      "Adaptadas al nivel: no es lo mismo devolver un trabajo de primaria que de secundaria.",
      "Exportables para enviar por email, imprimir o pegar en el cuaderno.",
    ],
  }} />
);