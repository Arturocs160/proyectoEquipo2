"use client";

import React from 'react';
import { Target, Users, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function About() {
    return (
        <main className="min-h-screen bg-[#fdfaf5] py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">

                <section className="text-center mb-20 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100">
                        <span>Nuestra historia</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#171717] tracking-tighter leading-tight mb-6 max-w-3xl">
                        Redefiniendo la forma en que los <span className="text-blue-600">negocios</span> gestionan su tiempo.
                    </h1>
                    <p className="text-[#666] text-lg md:text-xl max-w-2xl leading-relaxed">
                        AppCitas nació de una necesidad simple: eliminar el caos de las agendas manuales y devolverle a los profesionales el control total sobre su jornada laboral.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 hover:-translate-y-2 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#171717] mb-3">Nuestra Misión</h3>
                        <p className="text-[#666] text-sm leading-relaxed">
                            Empoderar a pequeños y medianos negocios con herramientas tecnológicas de alto nivel que simplifiquen su administración diaria.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 hover:-translate-y-2 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#171717] mb-3">Enfoque Humano</h3>
                        <p className="text-[#666] text-sm leading-relaxed">
                            Creemos que la tecnología debe servir para mejorar las relaciones entre profesionales y clientes, no para complicarlas.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 hover:-translate-y-2 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-[#171717] mb-3">Agilidad Total</h3>
                        <p className="text-[#666] text-sm leading-relaxed">
                            Diseñamos una plataforma rápida e intuitiva que permite reservar una cita en menos de un minuto, sin fricciones.
                        </p>
                    </div>
                </div>

                <section className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 lg:p-16 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-[#171717] mb-6 tracking-tight">Más que un software, <br />tu aliado estratégico.</h2>
                            <p className="text-[#666] mb-6 leading-relaxed">
                                Entendemos que cada consulta médica, salón de belleza o despacho legal tiene necesidades únicas. Por eso, hemos creado un sistema modular que se adapta a tu flujo de trabajo.
                            </p>
                            <p className="text-[#666] leading-relaxed mb-8">
                                Hoy ayudamos a cientos de emprendedores a profesionalizar su atención al cliente, reduciendo las inasistencias y optimizando cada hora de su agenda.
                            </p>
                            <div className="h-px w-full bg-black/5 mb-8" />
                            <Link
                                href="/register"
                                className="flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
                            >
                                Únete a la comunidad de AppCitas <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="bg-blue-600 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-700 opacity-90" />
                            <div className="relative z-10 text-white p-12 text-center">
                                <p className="text-5xl font-bold mb-4">+500</p>
                                <p className="text-blue-100 font-medium">Negocios confían en nosotros para gestionar sus citas diariamente.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}