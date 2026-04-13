"use client";
import {
  Search,
  Clock,
  Filter,
  ChevronRight,
  Trash2,
  CalendarX,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  servicio: string;
  bookerName: string | null;
  bookerEmail: string | null;
  empleado: string | null;
  hora: string;
  status: "Confirmado" | "Pendiente" | "Cancelado" | "Completado";
  raw_date: string;
}

interface Branch {
  id: number;
  name: string;
}

type FilterStatus = "Todos" | "Confirmado" | "Pendiente" | "Cancelado" | "Completado";

const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function ListaCitasPage() {
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("Todos");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch citas por branchId
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

  useEffect(() => {
    if (businessId && accessToken) {
      fetchBranches();
    }
  }, [businessId, accessToken]);

  useEffect(() => {
    if (!selectedBranchId || !accessToken) return;
    fetchAppointments();
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveBranchId", selectedBranchId);
    }
  }, [selectedBranchId, accessToken]);

  // Actualizar status de una cita
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Eliminar cita
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta cita?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  // Filtro combinado: búsqueda + status
  const filtered = appointments.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.servicio?.toLowerCase().includes(q) ||
      c.bookerName?.toLowerCase().includes(q) ||
      c.empleado?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "Todos" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const STATUS_FILTERS: FilterStatus[] = ["Todos", "Confirmado", "Pendiente", "Cancelado", "Completado"];

  const statusStyles: Record<string, string> = {
    Confirmado: "bg-green-50 text-green-700 border border-green-100",
    Pendiente: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    Cancelado: "bg-red-50 text-red-700 border border-red-100",
    Completado: "bg-blue-50 text-blue-700 border border-blue-100",
  };

  // Mapeo a valores del backend (enum en DB)
  const statusToBackend: Record<string, string> = {
    Confirmado: "confirmed",
    Pendiente: "pending",
    Cancelado: "cancelled",
    Completado: "completed",
  };

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Lista de Citas</h1>
            <p className="text-[#666] mt-1">Gestiona y revisa todas tus reservas programadas.</p>
          </div>
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value)}
            className="h-11 px-3 rounded-xl border border-black/10 bg-white text-sm"
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
        </header>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por cliente o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center justify-center gap-2 px-6 h-12 border rounded-xl font-semibold transition-colors shadow-sm
              ${showFilters ? "bg-blue-600 text-white border-blue-600" : "bg-white text-[#171717] border-black/5 hover:bg-gray-50"}`}
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Chips de filtro por status */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all
                  ${statusFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-[#444] border-black/10 hover:border-blue-400"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Cliente</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Empleado</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Servicio</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Fecha</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Horario</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Estado</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Cambiar estado</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-12 text-center text-[#666] text-sm">
                      Cargando citas...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <CalendarX size={36} />
                        <p className="text-sm font-medium">
                          {searchQuery || statusFilter !== "Todos"
                            ? "Sin resultados para los filtros aplicados."
                            : "No hay citas registradas."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((cita) => (
                    <tr key={cita.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-semibold text-[#171717]">
                          {cita.bookerName ?? <span className="italic text-gray-400 font-normal">Sin nombre</span>}
                        </p>
                        {cita.bookerEmail && (
                          <p className="text-xs text-[#666] mt-0.5">{cita.bookerEmail}</p>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        {cita.empleado
                          ? <span className="text-sm font-semibold text-[#444]">{cita.empleado}</span>
                          : <span className="text-xs text-gray-400 italic">Sin asignar</span>
                        }
                      </td>
                      <td className="px-8 py-5 text-[#444] font-medium">{cita.servicio}</td>
                      <td className="px-8 py-5 text-sm text-[#444] font-medium whitespace-nowrap">
                        {formatDate(cita.raw_date)}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                          <Clock size={14} />
                          {cita.hora}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[cita.status] ?? ""}`}>
                          {cita.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <select
                          value={statusToBackend[cita.status]}
                          onChange={(e) => handleUpdateStatus(cita.id, e.target.value)}
                          className="text-xs border border-black/10 rounded-lg px-2 py-1.5 bg-white text-[#444] outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="completed">Completado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleDelete(cita.id)}
                            className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Eliminar cita"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2 rounded-lg text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conteo de resultados */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-[#666] mt-4 ml-1">
            Mostrando {filtered.length} de {appointments.length} citas
          </p>
        )}
      </section>
    </main>
  );
}