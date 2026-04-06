"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Clock,
  CheckCircle2,
  CalendarCheck,
  ChevronRight
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">
              ¡Hola, {session?.user?.name || "Arturo"}!
            </h1>
            <p className="text-[#666] mt-1">Esto es lo que está pasando en tu agenda hoy.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#171717] leading-none">{session?.user?.name}</p>
              <p className="text-xs text-[#666] mt-1">Administrador</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-4xl p-8 border border-black/5 shadow-xl shadow-blue-900/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarCheck size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171717]">12</p>
              <p className="text-[#666] text-sm font-medium">Citas este mes</p>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-8 border border-black/5 shadow-xl shadow-blue-900/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171717]">45</p>
              <p className="text-[#666] text-sm font-medium">Completadas</p>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-8 border border-black/5 shadow-xl shadow-blue-900/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#171717]">3</p>
              <p className="text-[#666] text-sm font-medium">Próximas hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 overflow-hidden">
          <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#171717]">Próximas citas</h2>
            <Link href="/admin/appointments-list" className="text-blue-600 text-sm font-bold hover:underline">Ver todas</Link>
          </div>

          <div className="p-4">
            <div className="flex flex-col">
              {[
                { time: "12:00", client: "Roberto Gómez", service: "Consulta General" },
                { time: "14:00", client: "Lucía Fernández", service: "Tratamiento VIP" },
                { time: "15:00", client: "Marcos Ruiz", service: "Seguimiento" },
                { time: "16:00", client: "Ana Belén", service: "Consulta General" },
              ].map((cita, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-blue-50/50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center border border-black/5">
                      <span className="text-xs font-bold text-blue-600">{cita.time}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#171717]">{cita.client}</p>
                      <p className="text-xs text-[#666]">{cita.service}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-100 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}