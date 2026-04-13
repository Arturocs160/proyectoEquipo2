"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Clock, CheckCircle2, CalendarCheck, ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  servicio: string;
  bookerName: string | null;
  bookerEmail: string | null;
  empleado: string | null;
  hora: string;
  status: string;
  raw_date: string;
}

interface Branch {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id;
  const businessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessSlug, setBusinessSlug] = useState("");
  const [copiedLink, setCopiedLink] = useState("");
  const [copyToast, setCopyToast] = useState<"success" | "error" | "">("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const fetchBranches = async () => {
    if (!businessId || !accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/business/${businessId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data } = await response.json();
      const list: Branch[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setBranches(list);

      if (list.length > 0) {
        const storedBranch = typeof window !== "undefined" ? localStorage.getItem("adminActiveBranchId") : null;
        const validStored = storedBranch && list.some((branch) => String(branch.id) === String(storedBranch));
        const branchId = validStored ? String(storedBranch) : String(list[0].id);
        setSelectedBranchId(branchId);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchAppointments = async () => {
    if (!selectedBranchId || !accessToken) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments?branchId=${selectedBranchId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const { data } = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinessSlug = async () => {
    if (!ownerId || !businessId || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-info/${ownerId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data } = await response.json();
      const list = Array.isArray(data) ? data : [];
      const currentBusiness = list.find((business: any) => String(business.id) === String(businessId));

      if (currentBusiness?.slug) {
        setBusinessSlug(currentBusiness.slug);
      }
    } catch (error) {
      console.error("Error fetching business slug:", error);
    }
  };

  const handleGenerateDirectLink = async () => {
    if (!businessSlug) return;

    const baseUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000").replace(/\/$/, "");
    const directLink = `${baseUrl}/client/business?slug=${encodeURIComponent(businessSlug)}`;

    try {
      await navigator.clipboard.writeText(directLink);
      setCopiedLink(directLink);
      setCopyToast("success");
    } catch (error) {
      console.error("Error copying direct link:", error);
      setCopiedLink(directLink);
      setCopyToast("error");
    }
  };

  useEffect(() => {
    if (businessId && accessToken) {
      fetchBranches();
      fetchBusinessSlug();
    }
  }, [ownerId, businessId, accessToken]);

  useEffect(() => {
    if (!selectedBranchId) return;
    fetchAppointments();

    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveBranchId", selectedBranchId);
    }
  }, [selectedBranchId, accessToken]);

  useEffect(() => {
    if (!copyToast) return;

    const timeoutId = setTimeout(() => {
      setCopyToast("");
    }, 2400);

    return () => clearTimeout(timeoutId);
  }, [copyToast]);

  // --- Helpers de Fecha Limpios y Nativos ---
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Inicio de HOY en tu zona horaria local
  const hoyMidnight = new Date(currentYear, currentMonth, currentDay);

  const citasEsteMes = appointments.filter((a) => {
    const d = new Date(a.raw_date); // JS maneja la zona horaria gracias a la "Z"
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const completadas = appointments.filter((a) => a.status === "Completado").length;

  const proximasHoy = appointments.filter((a) => {
    const d = new Date(a.raw_date);
    const esHoy =
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth &&
      d.getDate() === currentDay;

    return esHoy && (a.status === "Pendiente" || a.status === "Confirmado") && d >= now;
  });

  const proximasCitas = appointments
    .filter((a) => {
      const d = new Date(a.raw_date);
      // Bajamos la hora de la cita a las 00:00 locales para compararla solo por día
      const citaMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());

      return (
        citaMidnight >= hoyMidnight &&
        (a.status === "Pendiente" || a.status === "Confirmado")
      );
    })
    .sort((a, b) => new Date(a.raw_date).getTime() - new Date(b.raw_date).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Citas este mes",
      value: isLoading ? "—" : citasEsteMes,
      icon: <CalendarCheck size={28} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completadas",
      value: isLoading ? "—" : completadas,
      icon: <CheckCircle2 size={28} />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Próximas hoy",
      value: isLoading ? "—" : proximasHoy.length,
      icon: <Clock size={28} />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      {copyToast && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-semibold border ${
              copyToast === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {copyToast === "success"
              ? "Link copiado al portapapeles"
              : "No se pudo copiar automaticamente"}
          </div>
        </div>
      )}

      <Sidebar />

      <section className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">
              ¡Hola, {session?.user?.name || "Admin"}!
            </h1>
            <p className="text-[#666] mt-1">Esto es lo que está pasando en tu agenda hoy.</p>
            {copiedLink && (
              <p className="text-xs text-blue-700 mt-2 break-all">
                Link generado: {copiedLink}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedBranchId}
              onChange={(event) => setSelectedBranchId(event.target.value)}
              className="h-10 px-3 rounded-lg border border-black/10 bg-white text-sm"
            >
              {branches.length === 0 ? (
                <option value="">Sin sucursales</option>
              ) : (
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handleGenerateDirectLink}
              disabled={!businessSlug}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Generar link directo
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#171717] leading-none">{session?.user?.name}</p>
              <p className="text-xs text-[#666] mt-1">Administrador</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold text-lg">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-4xl p-8 border border-black/5 shadow-xl shadow-blue-900/5 flex items-center gap-5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-[#171717]">{stat.value}</p>
                <p className="text-[#666] text-sm font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Próximas citas */}
        <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#171717]">Próximas citas</h2>
            <Link href="/admin/appointments-list" className="text-blue-600 text-sm font-bold hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="p-4">
            {isLoading ? (
              <p className="text-sm text-[#666] text-center py-8">Cargando citas...</p>
            ) : proximasCitas.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-gray-400 py-10">
                <CalendarCheck size={36} />
                <p className="text-sm font-medium">No hay citas próximas programadas.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {proximasCitas.map((cita) => {
                  const fechaFull = new Date(cita.raw_date);

                  const eHoy =
                    fechaFull.getFullYear() === currentYear &&
                    fechaFull.getMonth() === currentMonth &&
                    fechaFull.getDate() === currentDay;

                  const fechaLabel = eHoy
                    ? "Hoy"
                    : fechaFull.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });

                  return (
                    <div key={cita.id} className="flex items-center justify-between p-4 hover:bg-blue-50/50 rounded-2xl transition-colors group">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-14 shrink-0 rounded-xl border border-black/5 overflow-hidden text-center shadow-sm">
                          <div className="bg-blue-600 text-white text-[9px] font-bold uppercase py-0.5 tracking-wider">
                            {fechaFull.toLocaleDateString("es-MX", { month: "short" })}
                          </div>
                          <div className="bg-white py-1">
                            <span className="text-xl font-extrabold text-[#171717] leading-none block">
                              {fechaFull.getDate()}
                            </span>
                            <span className="text-[9px] font-semibold text-[#666] uppercase tracking-wide">
                              {fechaFull.toLocaleDateString("es-MX", { weekday: "short" })}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#171717] truncate">
                              {cita.bookerName ?? <span className="italic text-gray-400 font-normal">Sin nombre</span>}
                            </p>
                            {eHoy && (
                              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {fechaLabel}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#666] truncate">{cita.servicio}</p>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-center px-6 min-w-32.5">
                        {cita.empleado ? (
                          <>
                            <span className="text-[10px] text-[#999] uppercase tracking-wide font-semibold">Empleado</span>
                            <span className="text-sm font-semibold text-[#444] mt-0.5">{cita.empleado}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-300 italic">Sin asignar</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                          <Clock size={11} />
                          {cita.hora}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:inline-block
                          ${cita.status === "Confirmado"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          }`}
                        >
                          {cita.status}
                        </span>
                        <Link href="/admin/appointments-list" className="p-2 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all">
                          <ChevronRight size={20} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}