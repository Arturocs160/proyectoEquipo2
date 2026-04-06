"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Tag,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Save,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function EdicionServicio() {
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
            Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Editar Servicio</h1>
          <p className="text-[#666] mt-1">Modifica los detalles del servicio seleccionado.</p>
        </header>

        <div className="max-w-4xl">
          <form className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="servicio" className="text-sm font-semibold text-[#171717] ml-1">
                Nombre del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="servicio"
                  placeholder="Peinado"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="coste" className="text-sm font-semibold text-[#171717] ml-1">
                Coste del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="coste"
                  placeholder="$320"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="descripcion" className="text-sm font-semibold text-[#171717] ml-1">
                Descripción detallada <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="descripcion"
                  rows={4}
                  placeholder="Escribe aquí los detalles del servicio..."
                  className="w-full p-4 pl-11 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                ></textarea>
                <FileText className="absolute left-3.5 top-4 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-[#171717] ml-1">Imagen del Servicio</label>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-32 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center text-gray-300 shrink-0">
                  <ImageIcon size={40} />
                </div>

                <div className="flex-1 w-full">
                  <div className="border-2 border-dashed border-black/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                    <input type="file" id="imagen" className="hidden" />
                    <p className="text-sm font-medium text-[#171717]">Haz clic para cambiar la imagen</p>
                    <p className="text-xs text-[#666] mt-1">PNG o JPG (Máx. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                <Save size={20} />
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/services-list')}
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