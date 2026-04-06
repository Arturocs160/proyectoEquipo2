"use client"
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fdfaf5] py-3 px-6 flex flex-col items-center font-sans no-scrollbar overflow-y-hidden">
      <section className="max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* Badge de confianza o novedad */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100 animate-fade-in">
          <CheckCircle2 size={14} />
          <span>Gestión inteligente para tu negocio</span>
        </div>

        <h1 className="font-bold text-4xl md:text-6xl text-[#171717] mb-6 tracking-tighter leading-[1.1]">
          Organiza tus citas. <br />
          <span className="text-blue-600">Gana tiempo.</span> Atiende mejor.
        </h1>

        <p className="text-lg md:text-xl text-[#444] font-medium mb-2 max-w-2xl">
          La solución integral para negocios y consultorios que buscan orden.
        </p>

        <p className="text-[#666] text-base md:text-lg mb-10 max-w-xl">
          Una plataforma diseñada para que tus clientes reserven en segundos mientras tú mantienes el control total de tu agenda.
        </p>

        {/* Botón de acción principal con estilo actualizado */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-lg px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300"
            onClick={() => router.push('/login')}
          >
            Comenzar ahora
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Contenedor de imagen mejorado */}
        <div className="w-full relative p-2 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-black/5 shadow-2xl shadow-blue-900/5 group">
          <div className="relative overflow-hidden rounded-4xl">
            <img
              src="https://media.istockphoto.com/id/2185364720/es/foto/psic%C3%B3loga-charla-y-mujer-mayor-con-notas-y-sonrisa-de-valoraci%C3%B3n-de-salud-mental-en-consulta.jpg?s=612x612&w=0&k=20&c=HGbmjGCXA5MsxAvpKXvaGYu_U3qxOzcZyss661P7ho4="
              alt="Plataforma de gestión de citas"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Overlay sutil para la imagen */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>

      </section>
    </main>
  );
}