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
  Clock,
  Loader2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useState, ChangeEvent, FormEvent } from "react";

export default function NuevoServicio() {
  const router = useRouter();
  const { data: session } = useSession();
  const businessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;


  const [formData, setFormData] = useState({
    name: "",
    price: "",
    durationMinutes: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setImageFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!businessId) {
      setError("Error de autenticación. No se encontró el negocio.");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("businessId", businessId as string);
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("durationMinutes", formData.durationMinutes);
      data.append("description", formData.description);

      if (imageFile) {
        data.append("image", imageFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        method: "POST",
        body: data,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el servicio");
      }

      router.push("/admin/services-list");
      router.refresh();

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

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
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {error && (
              <div className="md:col-span-2 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label htmlFor="name" className="text-sm font-semibold text-[#171717] ml-1">
                Nombre del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Limpieza Facial"
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="price" className="text-sm font-semibold text-[#171717] ml-1">
                  Precio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="durationMinutes" className="text-sm font-semibold text-[#171717] ml-1">
                  Duración (min) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="durationMinutes"
                    name="durationMinutes"
                    required
                    min="1"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    placeholder="45"
                    className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                  />
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-[#171717] ml-1">
                Descripción del Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe brevemente en qué consiste este servicio..."
                  className="w-full p-4 pl-11 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                ></textarea>
                <FileText className="absolute left-3.5 top-4 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-[#171717] ml-1">Imagen del Servicio</label>

              <label
                htmlFor="imagen"
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group
                  ${imageFile ? 'border-blue-500 bg-blue-50/30' : 'border-black/10 bg-gray-50/50 hover:bg-blue-50/50'}
                `}
              >
                <input
                  type="file"
                  id="imagen"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {imageFile ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <ImageIcon size={32} className="mb-2" />
                    <p className="text-sm font-medium">{imageFile.name}</p>
                    <p className="text-xs text-blue-500/80 mt-1">Haz clic para cambiar la imagen</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-black/5 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-3">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm font-medium text-[#171717]">Haz clic para subir o arrastra una imagen</p>
                    <p className="text-xs text-[#666] mt-1">PNG, JPG hasta 5MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-fit inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Crear Servicio
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
}