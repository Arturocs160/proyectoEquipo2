"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  ChevronRight,
  Tag
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Service {
  id: number;
  businessId: string;
  name: string;
  duration_minutes: number;
  price: number;
  image_url: string;
  description: string;
}

export default function ListaServiciosPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtra por nombre o descripción (case-insensitive)
  const filteredServices = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/business/${businessId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        }
      });
      const data = await response.json();
      const formattedServices: Service[] = data.data.map((service: any) => ({
        id: service.id,
        businessId: service.businessId,
        name: service.name,
        duration_minutes: service.duration_minutes,
        price: service.price,
        image_url: service.image_url,
        description: service.description,
      }));
      setServices(formattedServices);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!businessId || !accessToken) return;
    fetchServices();
  }, [businessId, accessToken]);

  const handleDeleteService = async (id: number) => {
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        }
      });
      if (result.ok) {
        fetchServices();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Servicios Ofrecidos</h1>
            <p className="text-[#666] mt-1">Configura y gestiona el catálogo de servicios de tu negocio.</p>
          </div>
          <Link
            href="/admin/new-service"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Agregar Servicio
          </Link>
        </header>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar servicio por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredServices.length === 0 ? (
            <p className="text-[#666] text-sm py-6 text-center">
              {searchQuery ? `Sin resultados para "${searchQuery}"` : "No hay servicios registrados."}
            </p>
          ) : (
            filteredServices.map((servicio) => (
              <div
                key={servicio.id}
                className="group bg-white rounded-4xl p-5 border border-black/5 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-400 shrink-0 overflow-hidden">
                  {servicio.image_url
                    ? <img src={servicio.image_url} alt={servicio.name} className="w-full h-full object-cover" />
                    : <ImageIcon size={32} />
                  }
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-[#171717]">{servicio.name}</h3>
                    <span className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center justify-center md:justify-start gap-1 text-blue-600 font-bold">
                      <Tag size={14} />
                      <span>${servicio.price}</span>
                    </div>
                  </div>
                  <p className="text-[#666] text-sm leading-relaxed max-w-xl">
                    {servicio.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/services-list/${servicio.id}`)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    title="Editar servicio"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(servicio.id)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    title="Eliminar servicio"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-px h-8 bg-gray-100 mx-2 hidden md:block" />
                  <button className="p-2 rounded-lg text-gray-300 hover:text-blue-600 transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}