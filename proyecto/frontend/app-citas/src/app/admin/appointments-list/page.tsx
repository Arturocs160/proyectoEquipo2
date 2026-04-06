"use client";
import {
  Search,
  Plus,
  Clock,
  Filter,
  ChevronRight
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function ListaCitasPage() {

  const citas = [
    { id: 1, cliente: "Roberto Gómez", servicio: "Consulta General", hora: "09:00 AM", status: "Confirmado" },
    { id: 2, cliente: "Lucía Fernández", servicio: "Tratamiento VIP", hora: "11:30 AM", status: "Pendiente" },
    { id: 3, cliente: "Marcos Ruiz", servicio: "Seguimiento", hora: "01:00 PM", status: "Confirmado" },
    { id: 4, cliente: "Ana Belén", servicio: "Consulta General", hora: "04:30 PM", status: "Cancelado" },
  ];

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Lista de Citas</h1>
            <p className="text-[#666] mt-1">Gestiona y revisa todas tus reservas programadas.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5">
            <Plus size={20} />
            Nueva Cita
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por cliente o servicio..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-white border border-black/5 rounded-xl font-semibold text-[#171717] hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Cliente</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Servicio</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Horario</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]">Estado</th>
                  <th className="px-8 py-5 text-sm font-bold text-[#171717]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-[#171717]">{cita.cliente}</p>
                      <p className="text-xs text-[#666]">ID: #{cita.id}204</p>
                    </td>
                    <td className="px-8 py-5 text-[#444] font-medium">{cita.servicio}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                        <Clock size={14} />
                        {cita.hora}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${cita.status === 'Confirmado' ? 'bg-green-50 text-green-700 border border-green-100' :
                        cita.status === 'Pendiente' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                          'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {cita.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}