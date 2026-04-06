"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MessageSquare,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Calendar as CalendarIcon,
    Clock,
    MapPin
} from "lucide-react";
import Logo from "@/components/Logo";

export default function DatosClientePage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("¡Cita confirmada!");
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-[#fdfaf5] p-6 font-sans relative pb-20">

            {/* Botón Volver al paso de Fecha y Hora */}
            <Link
                href="/client/create-appointment"
                className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group z-10"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver a fecha y hora
            </Link>

            <header className="text-center mb-12 mt-16 flex flex-col items-center">
                <div className="mb-6 scale-110">
                    <Logo />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
                    <CheckCircle2 size={14} />
                    <span>Paso 3: Tus Datos</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#171717] tracking-tight mb-4">
                    Finalizar <span className="text-blue-600">Reserva</span>
                </h1>
            </header>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Formulario */}
                <section className="lg:col-span-3 bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-[#171717] ml-1">Nombre Completo</label>
                            <div className="relative">
                                <input type="text" placeholder="Ej. Juan Pérez" className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all" required />
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#171717] ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <input type="email" placeholder="tu@email.com" className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all" required />
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-[#171717] ml-1">Teléfono</label>
                            <div className="relative">
                                <input type="tel" placeholder="+52..." className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all" required />
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-sm font-semibold text-[#171717] ml-1">Notas (opcional)</label>
                            <div className="relative">
                                <textarea rows={3} placeholder="Instrucciones especiales..." className="w-full p-4 pl-11 border border-black/10 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"></textarea>
                                <MessageSquare className="absolute left-3.5 top-4 text-gray-400" size={18} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white h-16 rounded-xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-4">
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Confirmar Cita Ahora <ShieldCheck size={22} /></>}
                        </button>
                    </form>
                </section>

                {/* Resumen Final */}
                <aside className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-8">
                        <h3 className="text-xl font-bold text-[#171717] mb-6 tracking-tight">Resumen final</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                    <CalendarIcon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Fecha Elegida</p>
                                    <p className="text-[#171717] font-bold text-sm">Domingo, 15 de Febrero</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-black/5">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Horario</p>
                                    <p className="text-[#171717] font-bold text-sm">10:00 AM</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center text-xl">
                            <span className="text-[#171717] font-bold">Total:</span>
                            <span className="text-blue-600 font-black">$320.00</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}