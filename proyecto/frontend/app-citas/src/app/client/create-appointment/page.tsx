"use client";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    ChevronRight,
    MapPin
} from "lucide-react";
import Logo from "@/components/Logo";

export default function AgendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("10:00 AM");

    const times = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

    return (
        <main className="min-h-screen bg-[#fdfaf5] p-6 font-sans relative pb-16">

            {/* Botón Volver al catálogo de servicios */}
            <Link
                href="/client/list-services"
                className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver a servicios
            </Link>

            <header className="text-center mb-12 mt-16 flex flex-col items-center">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
                    <CheckCircle2 size={14} />
                    <span>Paso 2: Fecha y Hora</span>
                </div>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Calendario y Horarios */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-blue-900/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CalendarIcon size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-[#171717]">Selecciona el día</h2>
                        </div>

                        <div className="flex justify-center">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                locale={es}
                                modifiersStyles={{
                                    selected: {
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        borderRadius: '50%', // Círculo perfecto
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }
                                }}
                                className="border-none"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-blue-900/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-[#171717]">Horarios disponibles</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {times.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${selectedTime === time
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                                        : "bg-gray-50 text-[#666] hover:bg-blue-50 hover:text-blue-600 border border-black/5"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Columna Derecha: Resumen Temporal */}
                <section className="lg:col-span-1">
                    <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-blue-900/5 overflow-hidden sticky top-24">
                        <div className="bg-blue-600 p-8 text-white">
                            <h2 className="text-2xl font-bold">Tu Selección</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CalendarIcon size={18} className="text-blue-600 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Día y Hora</p>
                                        <p className="text-[#171717] font-bold">
                                            {format(selectedDate, "PPP", { locale: es })}
                                        </p>
                                        <p className="text-blue-600 text-sm font-bold">{selectedTime}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-black/5 w-full" />
                            {/* Botón para ir al Paso 3 */}
                            <Link
                                href="/client/client-data"
                                className="w-full bg-blue-600 text-white font-bold text-lg px-6 h-16 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group"
                            >
                                Continuar con mis datos
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}