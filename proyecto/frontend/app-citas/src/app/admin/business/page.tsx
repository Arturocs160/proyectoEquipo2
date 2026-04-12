"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Tag,
  AlignLeft,
  MapPin,
  Clock,
  Star,
  Save,
  CalendarX,
  Trash2,
  Plus
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function BusinessInfoPage() {
  // Estado para el horario dinámico por día
  const [schedule, setSchedule] = useState([
    { id: 1, name: "Lunes", isActive: true, open: "09:00", close: "18:00" },
    { id: 2, name: "Martes", isActive: true, open: "09:00", close: "18:00" },
    { id: 3, name: "Miércoles", isActive: true, open: "09:00", close: "18:00" },
    { id: 4, name: "Jueves", isActive: true, open: "09:00", close: "18:00" },
    { id: 5, name: "Viernes", isActive: true, open: "09:00", close: "18:00" },
    { id: 6, name: "Sábado", isActive: true, open: "09:00", close: "14:00" },
    { id: 0, name: "Domingo", isActive: false, open: "09:00", close: "18:00" },
  ]);

  const [disabledDates, setDisabledDates] = useState([
    { id: 1, date: "2026-12-25", reason: "Navidad" },
    { id: 2, date: "2026-01-01", reason: "Año Nuevo" }
  ]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  const handleScheduleChange = (index: number, field: string, value: any) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  const handleAddDisabledDate = () => {
    if (!newDate) return;
    setDisabledDates([...disabledDates, { id: Date.now(), date: newDate, reason: newReason || "Sin especificar" }]);
    setNewDate("");
    setNewReason("");
  };

  const handleRemoveDisabledDate = (id: number) => {
    setDisabledDates(disabledDates.filter(d => d.id !== id));
  };

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-[#666] hover:text-blue-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver al panel principal
          </Link>
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Información del Negocio</h1>
          <p className="text-[#666] mt-1">Configura los datos de tu negocio que verán tus clientes.</p>
        </header>

        <div className="max-w-4xl">
          <form className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10">
            <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4">Detalles Generales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label htmlFor="nombre" className="text-sm font-semibold text-[#171717] ml-1">
                  Nombre del Negocio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nombre"
                    defaultValue="Studio de Belleza Arturo"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label htmlFor="especialidad" className="text-sm font-semibold text-[#171717] ml-1">
                  Especialidad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="especialidad"
                    defaultValue="Estética & Bienestar"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="descripcion" className="text-sm font-semibold text-[#171717] ml-1">
                  Descripción
                </label>
                <div className="relative">
                  <textarea
                    id="descripcion"
                    rows={4}
                    defaultValue="Especialistas en transformar tu imagen con técnicas modernas y atención personalizada. Nuestro compromiso es resaltar tu belleza natural en un ambiente relajado y profesional."
                    className="w-full p-4 pl-11 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                  ></textarea>
                  <AlignLeft className="absolute left-3.5 top-4 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Contacto y Ubicación</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label htmlFor="ubicacion" className="text-sm font-semibold text-[#171717] ml-1">
                  Dirección
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ubicacion"
                    defaultValue="Av. Reforma 123, Ciudad de México"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-1">
                <label htmlFor="rating" className="text-sm font-semibold text-[#171717] ml-1">
                  Calificación (Opcional - solo para mostrar)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="rating"
                    defaultValue="4.9 (120 reseñas)"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Horario de Atención</h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-black/5 mb-10">
              <div className="text-sm text-[#666] mb-6 flex items-center gap-2">
                 <Clock size={16} /> Configura los días y horas exactas en las que tu negocio recibe citas.
              </div>
              <div className="flex flex-col gap-4">
                {schedule.map((day, index) => (
                  <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={day.isActive} 
                          onChange={(e) => handleScheduleChange(index, 'isActive', e.target.checked)} 
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                      <span className={`font-bold w-24 ${day.isActive ? 'text-[#171717]' : 'text-gray-400'}`}>{day.name}</span>
                    </div>
                    
                    <div className={`flex items-center gap-3 ${!day.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input 
                        type="time" 
                        value={day.open}
                        onChange={(e) => handleScheduleChange(index, 'open', e.target.value)}
                        className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-blue-600 bg-white"
                      />
                      <span className="text-[#666]">-</span>
                      <input 
                        type="time" 
                        value={day.close}
                        onChange={(e) => handleScheduleChange(index, 'close', e.target.value)}
                        className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-blue-600 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Días Feriados / Cerrados</h2>
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mb-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarX size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#171717] mb-1">Restricción de Fechas</h3>
                  <p className="text-sm text-[#666]">Bloquea directamente fechas específicas (como el 25 de Diciembre) para que nadie pueda agendar en esos días.</p>
                </div>
              </div>

              {/* Lista de fechas bloqueadas */}
              {disabledDates.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {disabledDates.map(dd => (
                    <div key={dd.id} className="bg-white border border-orange-200 shadow-sm rounded-lg py-2 px-3 flex items-center gap-3">
                      <div>
                        <span className="font-bold text-sm text-[#171717] block">{dd.date}</span>
                        <span className="text-xs text-[#666]">{dd.reason}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveDisabledDate(dd.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar nueva fecha */}
              <div className="bg-white p-4 rounded-xl border border-orange-100 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
                  <label className="text-xs font-semibold text-[#171717]">Fecha a bloquear</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-orange-500 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
                  <label className="text-xs font-semibold text-[#171717]">Motivo (opcional)</label>
                  <input type="text" placeholder="Ej. Año Nuevo" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-orange-500 text-sm" />
                </div>
                <button type="button" onClick={handleAddDisabledDate} className="w-full md:w-auto h-10 px-4 bg-orange-100 text-orange-600 font-bold rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} /> Agregar
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                <Save size={20} />
                Guardar Cambios
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}
