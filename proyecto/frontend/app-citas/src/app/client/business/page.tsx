"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Clock, Star, ChevronRight, Info, Search } from "lucide-react";
import Logo from "@/components/Logo";

interface BusinessInfo {
  id: number;
  name: string;
  specialty: string | null;
  description: string | null;
  location: string | null;
  rating: string | null;
  logo_url: string | null;
  slug: string;
}

interface BusinessHour {
  day_of_week: number;
  name: string;
  isActive: boolean;
  open: string;
  close: string;
}

const DAY_ORDER = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export default function ExplorarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  const [slugInput, setSlugInput] = useState(slug);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [hours, setHours] = useState<BusinessHour[]>([]);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!slug) {
        setLoading(false);
        setBusiness(null);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-info/slug/${slug}`);
        const payload = await response.json();
        const row = Array.isArray(payload?.data) ? payload.data[0] : null;

        if (!row) {
          setBusiness(null);
          setError("No se encontro informacion para este negocio");
          setLoading(false);
          return;
        }

        const mapped: BusinessInfo = {
          id: row.id,
          name: row.name,
          specialty: row.specialty,
          description: row.description,
          location: row.location,
          rating: row.rating,
          logo_url: row.logo_url,
          slug: row.slug,
        };

        setBusiness(mapped);

        const hoursResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours/${mapped.id}`);
        const hoursPayload = await hoursResponse.json();
        const mappedHours: BusinessHour[] = (Array.isArray(hoursPayload?.data) ? hoursPayload.data : []).map((item: any) => ({
          day_of_week: Number(item.day_of_week),
          name: item.name,
          isActive: Boolean(item.isActive),
          open: item.open,
          close: item.close,
        }));

        setHours(mappedHours);
      } catch (requestError) {
        setError("No fue posible cargar el negocio");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug]);

  const scheduleSummary = useMemo(() => {
    if (hours.length === 0) return "Horario no configurado";

    const active = hours.filter((hour) => hour.isActive).sort((a, b) => a.day_of_week - b.day_of_week);
    if (active.length === 0) return "No recibe citas actualmente";

    const dayNames = active.map((hour) => hour.name).filter(Boolean);
    const open = active[0].open;
    const close = active[0].close;

    const first = DAY_ORDER.find((day) => day === dayNames[0]) || dayNames[0];
    const last = DAY_ORDER.find((day) => day === dayNames[dayNames.length - 1]) || dayNames[dayNames.length - 1];

    return `${first} - ${last}: ${open} - ${close}`;
  }, [hours]);

  const submitSlug = () => {
    const value = slugInput.trim();
    if (!value) return;
    router.push(`/client/business?slug=${encodeURIComponent(value)}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 font-sans">
        <p className="text-[#666] font-medium">Cargando informacion del negocio...</p>
      </main>
    );
  }

  if (!slug || !business) {
    return (
      <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center p-6 font-sans relative pb-16">
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
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Buscar negocio</h1>
          <p className="text-[#666] mt-2">Ingresa el slug publico del negocio para continuar.</p>
        </header>

        <section className="w-full max-w-xl bg-white rounded-3xl border border-black/5 shadow-xl p-8">
          <label className="text-sm font-semibold text-[#171717] block mb-2">Slug del negocio</label>
          <div className="flex gap-3">
            <input
              value={slugInput}
              onChange={(event) => setSlugInput(event.target.value)}
              placeholder="Ej. studio-arturo"
              className="flex-1 h-12 px-4 border border-black/10 rounded-xl outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={submitSlug}
              className="h-12 px-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center p-6 font-sans relative pb-16">
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

      <section className="w-full max-w-3xl bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-blue-900/5 overflow-hidden">
        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-400 w-full" />

        <div className="px-8 pb-10 -mt-16 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-4xl bg-white p-2 shadow-xl mb-6 overflow-hidden">
            {business.logo_url ? (
              <img src={business.logo_url} alt={business.name} className="w-full h-full rounded-3xl object-cover" />
            ) : (
              <div className="w-full h-full rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="text-4xl font-bold">{business.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {business.specialty && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100 uppercase tracking-wider">
              {business.specialty}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-[#171717] tracking-tight mb-4">{business.name}</h1>

          {business.rating && (
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-500 mb-6 bg-amber-50 px-3 py-1 rounded-full">
              <Star size={16} fill="currentColor" />
              {business.rating}
            </div>
          )}

          <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-10">{business.description || "Sin descripcion disponible"}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-black/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ubicacion</p>
                <p className="text-[#171717] font-medium text-sm leading-tight mt-0.5">{business.location || "Sin ubicacion registrada"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-black/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Horario</p>
                <p className="text-[#171717] font-medium text-sm leading-tight mt-0.5">{scheduleSummary}</p>
              </div>
            </div>
          </div>

          <Link
            href={`/client/list-services?businessId=${business.id}&slug=${encodeURIComponent(business.slug)}`}
            className="w-full md:w-fit inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-bold text-lg px-12 h-16 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300"
          >
            Ver servicios disponibles
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      <div className="mt-12 flex items-center gap-2 text-[#666] text-sm">
        <Info size={16} className="text-blue-500" />
        <span>Reserva en menos de 2 minutos</span>
      </div>
    </main>
  );
}
