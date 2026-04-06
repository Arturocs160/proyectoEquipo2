"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Simulación de envío
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <main className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6 font-sans">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100 w-fit">
                        <span>Estamos para ayudarte</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-[#171717] tracking-tight leading-tight mb-6">
                        ¿Tienes alguna <span className="text-blue-600">pregunta?</span>
                    </h1>

                    <p className="text-[#666] text-lg mb-10 leading-relaxed">
                        Ya sea que necesites soporte técnico o quieras saber cómo escalar tu negocio con AppCitas, nuestro equipo está listo para escucharte.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Escríbenos</p>
                                <p className="text-[#171717] font-medium">soporte@appcitas.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Llámanos</p>
                                <p className="text-[#171717] font-medium">+52 (55) 1234 5678</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-black/5 p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-semibold text-[#171717] ml-1">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Tu nombre completo"
                                className="h-12 px-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="h-12 px-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-sm font-semibold text-[#171717] ml-1">Mensaje</label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder="¿En qué podemos ayudarte?"
                                className="p-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Enviar mensaje
                                    <Send size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-2">
                            Al enviar, aceptas nuestras políticas de privacidad.
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}