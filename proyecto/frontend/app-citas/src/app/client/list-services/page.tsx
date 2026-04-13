"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Briefcase, ChevronRight, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Logo from "@/components/Logo";

interface Service {
  id: number;
  business_id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  image_url: string | null;
}

export default function ServiciosPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId") || "";
  const slug = searchParams.get("slug") || "";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      if (!businessId) {
        setError("No se encontro el negocio seleccionado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/business/${businessId}`);
        const payload = await response.json();
        const rows = Array.isArray(payload?.data) ? payload.data : [];
        setServices(rows);
      } catch (requestError) {
        setError("No fue posible cargar los servicios");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [businessId]);

  const backHref = useMemo(() => {
    if (slug) {
      return `/client/business?slug=${encodeURIComponent(slug)}`;
    }
    return "/client/business";
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center p-6 font-sans relative pb-16">
      <Link
        href={backHref}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al negocio
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
          Selecciona tu <span className="text-blue-600">Servicio</span>
        </h1>
        <p className="text-[#666] text-lg max-w-xl leading-relaxed">Escoge una opcion para continuar con la reserva.</p>
      </header>

      {loading && <p className="text-[#666] font-medium">Cargando servicios...</p>}
      {!loading && error && <p className="text-red-600 font-medium">{error}</p>}

      {!loading && !error && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-16">
          {services.map((service) => {
            const href = `/client/create-appointment?businessId=${businessId}&serviceId=${service.id}&serviceName=${encodeURIComponent(
              service.name
            )}&duration=${service.duration_minutes}&price=${service.price ?? ""}&slug=${encodeURIComponent(slug)}`;

            return (
              <Link
                key={service.id}
                href={href}
                className="group relative bg-white border border-black/5 rounded-4xl shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-600/15 hover:-translate-y-2 transition-all duration-500 text-left flex flex-col overflow-hidden"
              >
                <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50 border-b border-black/5">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-xs font-medium">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-7 flex flex-col items-start gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#171717] tracking-tight leading-snug">{service.name}</h3>
                  </div>

                  <p className="text-sm text-[#666] leading-relaxed mb-2">{service.description || "Sin descripcion"}</p>
                  <p className="text-sm text-[#666] leading-relaxed mb-1">Precio: {service.price ? `$${service.price}` : "Por definir"}</p>
                  <p className="text-sm text-[#666] leading-relaxed">Duracion: {service.duration_minutes} minutos</p>

                  <div className="mt-auto pt-4 flex items-center gap-2 text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                    Seleccionar <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
