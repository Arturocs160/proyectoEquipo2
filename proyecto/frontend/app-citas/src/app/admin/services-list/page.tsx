"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  ChevronRight,
  Tag
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function ListaServiciosPage() {
  const router = useRouter();

  const servicios = [
    { id: 1, nombre: "Consulta General", descripcion: "Evaluación completa y diagnóstico preventivo.", precio: "45.00" },
    { id: 2, nombre: "Tratamiento VIP", descripcion: "Servicio premium con atención personalizada.", precio: "120.00" },
    { id: 3, nombre: "Limpieza Profunda", descripcion: "Mantenimiento y cuidado especializado.", precio: "75.00" },
    { id: 4, nombre: "Seguimiento", descripcion: "Revisión de resultados y ajustes de tratamiento.", precio: "30.00" },
  ];

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Servicios Ofrecidos</h1>
            <p className="text-[#666] mt-1">Configura y gestiona el catálogo de servicios de tu negocio.</p>
          </div>
          <Link
            href="/admin/new-service"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Agregar Servicio
          </Link>
        </header>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar servicio por nombre..."
            className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="group bg-white rounded-4xl p-5 border border-black/5 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                <ImageIcon size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#171717]">{servicio.nombre}</h3>
                  <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center justify-center md:justify-start gap-1 text-blue-600 font-bold">
                    <Tag size={14} />
                    <span>${servicio.precio}</span>
                  </div>
                </div>
                <p className="text-[#666] text-sm leading-relaxed max-w-xl">
                  {servicio.descripcion}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/admin/edit-service')}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Editar servicio"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Eliminar servicio"
                >
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-8 bg-gray-100 mx-2 hidden md:block" />
                <button className="p-2 rounded-lg text-gray-300 hover:text-blue-600 transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}