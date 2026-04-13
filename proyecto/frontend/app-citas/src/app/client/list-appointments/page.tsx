"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Search,
  Mail,
  Hash,
  Loader2
} from "lucide-react";
import Logo from "@/components/Logo";

interface AppointmentItem {
  id: number;
  dia: string;
  mes: string;
  servicio: string;
  negocio: string;
  direccion: string;
  status: string;
}

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", { month: "short" }).format(date).replace(".", "").toUpperCase();

const mapStatus = (status: string) => {
  if (status === "confirmed") return "Confirmada";
  if (status === "cancelled") return "Cancelada";
  if (status === "completed") return "Completada";
  return "Pendiente";
};

const isStatusGreen = (status: string) => status === "Confirmada" || status === "Completada";

export default function CitasPage() {
  // Estados para el flujo sin sesión
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [error, setError] = useState("");
  const [citas, setCitas] = useState<AppointmentItem[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams({ email: email.trim() });
      if (folio.trim()) {
        params.set("folio", folio.trim());
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/search?${params.toString()}`);
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error || payload?.message || "No se pudo realizar la búsqueda");
      }

      const data = Array.isArray(payload?.data) ? payload.data : [];
      const mapped: AppointmentItem[] = data.map((item: any) => {
        const date = new Date(item.scheduled_at);
        const validDate = Number.isNaN(date.getTime()) ? new Date() : date;

        return {
          id: item.id,
          dia: String(validDate.getDate()).padStart(2, "0"),
          mes: formatMonth(validDate),
          servicio: item.service_name || "Servicio",
          negocio: item.business_name || "Negocio",
          direccion: item.branch_address || item.branch_name || "Dirección no disponible",
          status: mapStatus(item.status),
        };
      });

      setCitas(mapped);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar citas");
      setHasSearched(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasSearched(false);
    setEmail("");
    setFolio("");
    setError("");
    setCitas([]);
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center p-6 font-sans relative pb-20">
      {/* Botón Volver Consistente */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <header className="text-center mb-12 mt-16 flex flex-col items-center w-full max-w-4xl">
        <div className="mb-8 scale-110">
          <Logo />
        </div>

        {!hasSearched ? (
          <>
            <h1 className="text-4xl font-bold text-[#171717] tracking-tighter">Consulta tu Cita</h1>
            <p className="text-[#666] mt-2 max-w-md">Ingresa tus datos para ver el estado de tus reservas sin necesidad de cuenta.</p>
          </>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-left">
              <h1 className="text-4xl font-bold text-[#171717] tracking-tighter">Mis Citas</h1>
              <p className="text-[#666] mt-2">Gestiona tus próximas visitas para <span className="font-bold text-blue-600">{email}</span></p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center px-6 h-14 rounded-2xl text-[#171717] font-semibold border border-black/10 hover:bg-black/5 transition-colors"
              >
                Nueva búsqueda
              </button>
              <Link
                href="/client/servicios"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 h-14 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
              >
                <Plus size={20} />
                Agendar nueva
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* VISTA 1: Buscador (Si no ha buscado) */}
      {!hasSearched ? (
        <section className="w-full max-w-110 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-black/5 p-10 animate-in fade-in zoom-in-95 duration-500">
          <form className="flex flex-col gap-6" onSubmit={handleSearch}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#171717] ml-1">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#171717] ml-1">Folio de Cita (Opcional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="Ej: #12345"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <Search size={20} />
                  Buscar mis citas
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
          </form>
        </section>
      ) : (
        /* VISTA 2: Listado (Si ya buscó) */
        <section className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {citas.length === 0 && (
            <div className="bg-white border border-black/5 p-8 rounded-4xl shadow-xl shadow-blue-900/5 text-center">
              <p className="text-lg font-semibold text-[#171717]">No encontramos citas con esos datos.</p>
              <p className="text-sm text-[#666] mt-2">Verifica tu correo y folio, o intenta sin folio para ver todas tus citas.</p>
            </div>
          )}

          {citas.map((cita) => (
            <div
              key={cita.id}
              className="group relative bg-white border border-black/5 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 flex flex-col md:flex-row items-center gap-8 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center w-24 h-24 rounded-4xl bg-blue-50 border border-blue-100 shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-500">
                <span className="text-xs font-bold text-blue-400 group-hover:text-blue-100 transition-colors uppercase tracking-widest">{cita.mes}</span>
                <span className="text-4xl font-black text-blue-600 group-hover:text-white transition-colors tracking-tighter">{cita.dia}</span>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="font-bold text-2xl text-[#171717] tracking-tight">{cita.servicio}</h3>
                  <span className={`w-fit mx-auto md:mx-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isStatusGreen(cita.status) ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                    {cita.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-[#444] flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-600" />
                    {cita.negocio}
                  </p>
                  <p className="text-sm text-[#666] flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    {cita.direccion}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <ChevronRight size={24} />
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}