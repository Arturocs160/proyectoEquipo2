"use client";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  CheckCircle2,
  Info
} from "lucide-react";
import Logo from "@/components/Logo";

export default function ExplorarPage() {
  // Datos simulados del negocio (que vendrían de tu backend/contexto)
  const negocio = {
    nombre: "Studio de Belleza Arturo",
    especialidad: "Estética & Bienestar",
    descripcion: "Especialistas en transformar tu imagen con técnicas modernas y atención personalizada. Nuestro compromiso es resaltar tu belleza natural en un ambiente relajado y profesional.",
    ubicación: "Av. Reforma 123, Ciudad de México",
    horario: "Lun - Sáb: 9:00 AM - 8:00 PM",
    rating: "4.9 (120 reseñas)"
  };

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

      <header className="text-center mb-12 mt-16 flex flex-col items-center">
        <div className="mb-8 scale-110">
          <Logo />
        </div>
      </header>

      {/* Tarjeta Principal de Información del Negocio */}
      <section className="w-full max-w-3xl bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-blue-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Banner Decorativo */}
        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-400 w-full" />

        <div className="px-8 pb-10 -mt-16 flex flex-col items-center text-center">
          {/* Avatar del Negocio */}
          <div className="w-32 h-32 rounded-4xl bg-white p-2 shadow-xl mb-6">
            <div className="w-full h-full rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="text-4xl font-bold">{negocio.nombre.charAt(0)}</span>
            </div>
          </div>

          {/* Información de Identidad */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100 uppercase tracking-wider">
            {negocio.especialidad}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#171717] tracking-tight mb-4">
            {negocio.nombre}
          </h1>

          <div className="flex items-center gap-2 text-sm font-semibold text-amber-500 mb-6 bg-amber-50 px-3 py-1 rounded-full">
            <Star size={16} fill="currentColor" />
            {negocio.rating}
          </div>

          <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-10">
            {negocio.descripcion}
          </p>

          {/* Grid de Datos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-black/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ubicación</p>
                <p className="text-[#171717] font-medium text-sm leading-tight mt-0.5">{negocio.ubicación}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-black/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Horario</p>
                <p className="text-[#171717] font-medium text-sm leading-tight mt-0.5">{negocio.horario}</p>
              </div>
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <Link
            href="/client/list-services"
            className="w-full md:w-fit inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-lg px-12 h-16 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300"
          >
            Ver servicios disponibles
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Ayuda o Información Extra */}
      <div className="mt-12 flex items-center gap-2 text-[#666] text-sm">
        <Info size={16} className="text-blue-500" />
        <span>Reserva garantizada en menos de 2 minutos</span>
      </div>
    </main>
  );
}