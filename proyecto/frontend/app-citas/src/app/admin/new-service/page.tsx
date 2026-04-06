"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Tag,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function NuevoServicio() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="mb-10">
          <Link
            href="/admin/services-list"
            className="inline-flex items-center gap-2 text-[#666] hover:text-blue-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver a servicios
          </Link>
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Crear Nuevo Servicio</h1>
          <p className="text-[#666] mt-1">Define los detalles del nuevo servicio que ofrecerás a tus clientes.</p>
        </header>

        <div className="max-w-3xl">
          <form className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="servicio" className="text-sm font-semibold text-[#171717] ml-1">
                Nombre del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="servicio"
                  placeholder="Ej. Limpieza Facial"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="coste" className="text-sm font-semibold text-[#171717] ml-1">
                Precio Sugerido <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="coste"
                  placeholder="0.00"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="descripcion" className="text-sm font-semibold text-[#171717] ml-1">
                Descripción del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="descripcion"
                  rows={4}
                  placeholder="Describe brevemente en qué consiste este servicio..."
                  className="w-full p-4 pl-11 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                ></textarea>
                <FileText className="absolute left-3.5 top-4 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-[#171717] ml-1">Imagen del Servicio</label>
              <div className="border-2 border-dashed border-black/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                <input type="file" id="imagen" className="hidden" />
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-3">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm font-medium text-[#171717]">Haz clic para subir o arrastra una imagen</p>
                <p className="text-xs text-[#666] mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full md:w-fit inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Crear Servicio
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}