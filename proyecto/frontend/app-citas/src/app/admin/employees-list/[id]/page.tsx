"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Users,
  Calendar,
  Save,
  Mail,
  Briefcase,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
}

export default function EditEmployee() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();

  const accessToken = session?.user?.accessToken;
  const businessId = session?.user?.businessId;

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Carga los datos del empleado al entrar a la página
  const fetchEmployee = async () => {
    if (!id || !accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data } = await res.json();
      const emp = Array.isArray(data) ? data[0] : data;

      if (emp) {
        // full_name puede ser "Juan López" — lo separamos en nombre y apellido
        const parts = (emp.full_name || "").split(" ");
        setName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setEmail(emp.email || "");
        setSpecialty(emp.specialty || "");
        setAge(emp.age !== null && emp.age !== undefined ? String(emp.age) : "");
        setIsActive(Boolean(emp.is_active));
        if (emp.branch_id) {
          setSelectedBranchId(String(emp.branch_id));
        }
      }
    } catch (err) {
      setFetchError("No se pudo cargar la información del empleado.");
    }
  };

  const fetchBranches = async () => {
    if (!businessId || !accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/business/${businessId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data } = await response.json();
      const list: Branch[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setBranches(list);

      if (!selectedBranchId && list.length > 0) {
        const storedBranch = typeof window !== "undefined" ? localStorage.getItem("adminActiveBranchId") : null;
        const validStored = storedBranch && list.some((branch) => String(branch.id) === String(storedBranch));
        const branchId = validStored ? String(storedBranch) : String(list[0].id);
        setSelectedBranchId(branchId);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchEmployee();
    }
  }, [id, accessToken]);

  useEffect(() => {
    if (businessId && accessToken) {
      fetchBranches();
    }
  }, [businessId, accessToken]);

  useEffect(() => {
    if (!selectedBranchId) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("adminActiveBranchId", selectedBranchId);
    }
  }, [selectedBranchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          branchId: selectedBranchId,
          fullName: `${name} ${lastName}`.trim(),
          specialty: specialty || null,
          age: parseInt(age),
          email: email,
          isActive: isActive,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al actualizar el empleado");
      }

      alert("Empleado actualizado exitosamente");
      router.push("/admin/employees-list");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error instanceof Error ? error.message : "Error desconocido al actualizar el empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="mb-10">
          <Link
            href="/admin/employees-list"
            className="inline-flex items-center gap-2 text-[#666] hover:text-blue-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver a la lista
          </Link>
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Editar Perfil del Empleado</h1>
          <p className="text-[#666] mt-1">Actualiza la información personal y laboral de tu colaborador.</p>
        </header>

        {fetchError && (
          <div className="max-w-3xl mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
            {fetchError}
          </div>
        )}

        <div className="max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Nombre */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="sucursal" className="text-sm font-semibold text-[#171717] ml-1">
                Sucursal <span className="text-red-500">*</span>
              </label>
              <select
                id="sucursal"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full h-12 px-3 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
              >
                {branches.length === 0 ? (
                  <option value="">Sin sucursales</option>
                ) : (
                  branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Nombre */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="nombre" className="text-sm font-semibold text-[#171717] ml-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nombre"
                  placeholder="Juan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Apellido */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="apellido" className="text-sm font-semibold text-[#171717] ml-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="apellido"
                  placeholder="Lopez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="juan@appcitas.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Especialidad */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="especialidad" className="text-sm font-semibold text-[#171717] ml-1">
                Cargo o Especialidad
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="especialidad"
                  placeholder="Ej. Terapeuta"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Edad */}
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label htmlFor="edad" className="text-sm font-semibold text-[#171717] ml-1">
                Edad
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="edad"
                  placeholder="25"
                  min={18}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Estado activo */}
            <div className="flex items-center gap-3 md:col-span-1 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
              <span className="text-sm font-semibold text-[#171717]">
                {isActive ? "Empleado activo" : "Empleado inactivo"}
              </span>
            </div>

            {/* Botones */}
            <div className="md:col-span-2 pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-10 h-14 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/employees-list")}
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