"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import Logo from "@/components/Logo";

function DatosClientePageContent() {
  const searchParams = useSearchParams();

  const businessId = searchParams.get("businessId") || "";
  const serviceId = searchParams.get("serviceId") || "";
  const employeeId = searchParams.get("employeeId") || "";
  const employeeName = searchParams.get("employeeName") || "";
  const branchId = searchParams.get("branchId") || "";
  const day = searchParams.get("day") || "";
  const hour = searchParams.get("hour") || "";
  const serviceName = searchParams.get("serviceName") || "Servicio";
  const price = searchParams.get("price") || "";
  const slug = searchParams.get("slug") || "";

  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookerPhone, setBookerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdFolio, setCreatedFolio] = useState("");

  const canSubmit = useMemo(() => Boolean(serviceId && employeeId && branchId && day && hour), [serviceId, employeeId, branchId, day, hour]);

  const backHref = `/client/create-appointment?businessId=${businessId}&serviceId=${serviceId}&serviceName=${encodeURIComponent(
    serviceName
  )}&price=${encodeURIComponent(price)}&slug=${encodeURIComponent(slug)}&branchId=${encodeURIComponent(branchId)}&employeeId=${encodeURIComponent(employeeId)}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setError("Falta informacion de la cita. Regresa al paso anterior.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchId: Number(branchId),
          serviceId: Number(serviceId),
          employeeId: Number(employeeId),
          day,
          hour,
          bookerName,
          bookerEmail,
          bookerPhone,
          notes: notes.trim() || null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "No fue posible crear la cita");
      }

      const folio = payload?.data?.insertId ? `#${payload.data.insertId}` : "generado";
      setCreatedFolio(folio);
      setSuccessMessage(`Tu cita fue creada correctamente. Folio: ${folio}`);

      setBookerName("");
      setBookerEmail("");
      setBookerPhone("");
      setNotes("");
    } catch (requestError: any) {
      setError(requestError?.message || "Error inesperado al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-6 font-sans relative pb-20">
      <Link
        href={backHref}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver a fecha y hora
      </Link>

      <header className="text-center mb-12 mt-16 flex flex-col items-center">
        <div className="mb-6 scale-110">
          <Logo />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
          <CheckCircle2 size={14} />
          <span>Paso 3: Tus Datos</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-[#171717] tracking-tight mb-4">
          Finalizar <span className="text-blue-600">Reserva</span>
        </h1>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
        <section className="lg:col-span-3 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-[#171717] ml-1">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  value={bookerName}
                  onChange={(event) => setBookerName(event.target.value)}
                  placeholder="Ej. Juan Perez"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  required
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#171717] ml-1">Correo Electronico</label>
              <div className="relative">
                <input
                  type="email"
                  value={bookerEmail}
                  onChange={(event) => setBookerEmail(event.target.value)}
                  placeholder="tu@email.com"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#171717] ml-1">Telefono</label>
              <div className="relative">
                <input
                  type="tel"
                  value={bookerPhone}
                  onChange={(event) => setBookerPhone(event.target.value)}
                  placeholder="+52..."
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  required
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-[#171717] ml-1">Notas (opcional)</label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Instrucciones especiales..."
                  className="w-full p-4 pl-11 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                ></textarea>
                <MessageSquare className="absolute left-3.5 top-4 text-gray-400" size={18} />
              </div>
            </div>

            {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
            {successMessage && <p className="md:col-span-2 text-sm text-green-700">{successMessage}</p>}

            {successMessage && (
              <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                <p className="font-semibold">
                  Puedes visualizar esta cita y tus otras reservas en la sección de consulta.
                </p>
                <p className="mt-1 text-blue-800">
                  Usa tu correo y, si lo tienes, el folio {createdFolio || "de tu cita"}.
                </p>
                <Link
                  href="/client/list-appointments"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Ver mis citas
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="md:col-span-2 bg-blue-600 text-white h-16 rounded-xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-4 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Guardando cita...
                </>
              ) : (
                <>
                  Confirmar Cita Ahora
                  <ShieldCheck size={22} />
                </>
              )}
            </button>
          </form>
        </section>

        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-8">
            <h3 className="text-xl font-bold text-[#171717] mb-6 tracking-tight">Resumen final</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Fecha Elegida</p>
                  <p className="text-[#171717] font-bold text-sm">{day || "No definida"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Horario</p>
                  <p className="text-[#171717] font-bold text-sm">{hour || "No definido"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-sm text-[#666]">Servicio</p>
              <p className="text-[#171717] font-bold">{serviceName}</p>
              <p className="text-sm text-[#666] mt-3">Sucursal</p>
              <p className="text-[#171717] font-bold">{branchId ? `#${branchId}` : "No definida"}</p>
              <p className="text-sm text-[#666] mt-3">Empleado</p>
              <p className="text-[#171717] font-bold">{employeeName || "No definido"}</p>
              <div className="mt-4 flex justify-between items-center text-xl">
                <span className="text-[#171717] font-bold">Total:</span>
                <span className="text-blue-600 font-black">{price ? `$${price}` : "Por definir"}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function DatosClientePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 font-sans">
          <p className="text-[#666] font-medium">Cargando informacion de la cita...</p>
        </main>
      }
    >
      <DatosClientePageContent />
    </Suspense>
  );
}
