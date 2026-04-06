"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Briefcase,
  ChevronRight,
  Mail
} from "lucide-react";

import Sidebar from "@/components/Sidebar";

export default function ListaEmpleadoPage() {
  const router = useRouter();

  const empleados = [
    { id: 1, nombre: "Carlos Pérez", rol: "Especialista en Corte", email: "carlos@appcitas.com", status: "Activo" },
    { id: 2, nombre: "Elena Torres", rol: "Administradora", email: "elena@appcitas.com", status: "Activo" },
    { id: 3, nombre: "Ricardo Sosa", rol: "Asistente", email: "ricardo@appcitas.com", status: "En pausa" },
    { id: 4, nombre: "Sofía Méndez", rol: "Terapeuta", email: "sofia@appcitas.com", status: "Activo" },
  ];

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Gestión de Equipo</h1>
            <p className="text-[#666] mt-1">Administra los accesos y roles de tus colaboradores.</p>
          </div>
          <Link
            href="/admin/new-employee"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Agregar Empleado
          </Link>
        </header>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cargo..."
            className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {empleados.map((emp) => (
            <div
              key={emp.id}
              className="group bg-white rounded-4xl p-5 border border-black/5 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl hover:shadow-blue-900/10"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0 border-2 border-white shadow-sm">
                {emp.nombre.charAt(0)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#171717]">{emp.nombre}</h3>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${emp.status === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {emp.status}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-[#666]">
                  <p className="flex items-center justify-center md:justify-start gap-1">
                    <Briefcase size={14} className="text-blue-500" /> {emp.rol}
                  </p>
                  <p className="flex items-center justify-center md:justify-start gap-1">
                    <Mail size={14} className="text-gray-400" /> {emp.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/admin/edit-employee')}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  title="Editar perfil"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="Eliminar empleado"
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