"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Users,
  Calendar,
  Briefcase,
  Mail,
  Plus,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function NuevoEmpleado() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="mb-10">
          <Link
            href="/admin/employees-list"
            className="inline-flex items-center gap-2 text-[#666] hover:text-blue-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Registrar Nuevo Colaborador</h1>
          <p className="text-[#666] mt-1">Completa la información para dar de alta a un nuevo miembro del equipo.</p>
        </header>

        <div className="max-w-4xl">
          <form className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="nombre" className="text-sm font-semibold text-[#171717] ml-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nombre"
                  placeholder="Ej. Juan"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="apellido" className="text-sm font-semibold text-[#171717] ml-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="apellido"
                  placeholder="Ej. López"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="juan@appcitas.com"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="rol" className="text-sm font-semibold text-[#171717] ml-1">
                Cargo o Especialidad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="rol"
                  placeholder="Ej. Terapeuta"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="edad" className="text-sm font-semibold text-[#171717] ml-1">
                Edad
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="edad"
                  placeholder="25"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Registrar empleado
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/employees-list')}
                className="inline-flex items-center justify-center px-10 h-14 rounded-xl text-[#171717] font-semibold border border-black/10 hover:bg-black/5 transition-colors"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}