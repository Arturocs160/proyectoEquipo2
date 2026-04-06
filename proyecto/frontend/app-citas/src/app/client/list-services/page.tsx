"use client";
import Link from "next/link";
import { ArrowLeft, Briefcase, ChevronRight, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Logo from "@/components/Logo";

export default function ServiciosPage() {
  // Simulación de servicios enriquecida con URLs de imágenes (que subiría el admin)
  // He usado imágenes de Unsplash relacionadas con servicios comunes (peluquería, masajes, consultoría)
  const servicios = [
    {
      id: 1,
      name: "Corte de Cabello Premium",
      description: "Estilo personalizado, lavado y peinado incluido.",
      image: "https://images.unsplash.com/photo-1593702288056-7927b442d0fa?q=80&w=600&auto=format&fit=crop",
      price: "150 MXN",
      duration: "30 minutos",
    },
    {
      id: 2,
      name: "Masaje Relajante",
      description: "60 minutos de relajación profunda con aceites esenciales.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
      price: "200 MXN",
      duration: "60 minutos",
    },
    {
      id: 3,
      name: "Asesoría Financiera",
      description: "Planificación y optimización de tus finanzas personales.",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=600&auto=format&fit=crop",
      price: "250 MXN",
      duration: "60 minutos",
    },
    {
      id: 4,
      name: "Tratamiento Facial",
      description: "Limpieza profunda e hidratación para tu piel.",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=600&auto=format&fit=crop",
      price: "250 MXN",
      duration: "60 minutos",
    },
    {
      id: 5,
      name: "Manicura y Pedicura",
      description: "Cuidado completo para tus manos y pies.",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop",
      price: "250 MXN",
      duration: "60 minutos",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center p-6 font-sans relative pb-16">

      {/* Botón Volver Consistente */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <header className="text-center mb-16 mt-16 flex flex-col items-center">
        <div className="mb-6 scale-110">
          <Logo />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
          <CheckCircle2 size={14} />
          <span>Paso 1: Elige tu servicio</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#171717] tracking-tight mb-4 leading-tight">
          Seleccione su <span className="text-blue-600">Servicio</span>
        </h1>
        <p className="text-[#666] text-lg max-w-xl leading-relaxed">
          Para comenzar con tu reserva, por favor elige la opción que mejor se adapte a lo que necesitas hoy.
        </p>
      </header>

      {/* Grid de Servicios con diseño de Tarjetas Mejorado con Imágenes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-16">
        {servicios.map((servicio) => (
          <button
            key={servicio.id}
            className="group relative bg-white border border-black/5 rounded-4xl shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-600/15 hover:-translate-y-2 transition-all duration-500 text-left flex flex-col overflow-hidden"
          >
            {/* Contenedor de Imagen (Slot para Admin) */}
            <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
              {servicio.image ? (
                <img
                  src={servicio.image}
                  alt={servicio.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                // Fallback visual si no hay imagen subida
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50 border-b border-black/5">
                  <ImageIcon size={32} strokeWidth={1} />
                  <span className="text-xs font-medium">Sin imagen</span>
                </div>
              )}
              {/* Overlay sutil para la imagen */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Contenedor de Texto con padding independiente */}
            <div className="p-7 flex flex-col items-start gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#171717] tracking-tight leading-snug">{servicio.name}</h3>
              </div>

              <p className="text-sm text-[#666] leading-relaxed mb-2">
                {servicio.description}
              </p>

              <p className="text-sm text-[#666] leading-relaxed mb-2">
                Precio: {servicio.price}
              </p>

              <p className="text-sm text-[#666] leading-relaxed mb-2">
                Duración: {servicio.duration}
              </p>

              <div className="mt-auto pt-4 flex items-center gap-2 text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                Seleccionar <ChevronRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </section>

    </main>
  );
}