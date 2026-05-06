import { ProductoProximamente } from "@/components/ProductoProximamente";

export const ACI = () => (
  <ProductoProximamente config={{
    id: "aci",
    nombre: "Adaptaciones curriculares (ACI)",
    tagline: "Cada alumno merece una clase a su medida.",
    descripcion: "Las adaptaciones curriculares son esenciales pero exigen tiempo y conocimiento normativo. Ohana te ayuda a generarlas respetando el marco legal argentino y las necesidades reales de cada alumno.",
    paraQuien: [
      "Docentes con alumnos integrados que necesitan ACI documentadas y pedagógicamente fundamentadas.",
      "Equipos de orientación que buscan agilizar la elaboración de adaptaciones.",
      "Docentes que trabajan en aulas diversas y quieren herramientas para la inclusión real.",
    ],
    features: [
      "ACIs generadas según el perfil del alumno y el contenido curricular del grado.",
      "Fundamentación pedagógica y normativa incluida — lista para presentar a supervisión.",
      "Adaptaciones de acceso, de contenido y de evaluación en un solo documento.",
      "Coherentes con la planificación del grupo y el DCP de la provincia.",
    ],
  }} />
);