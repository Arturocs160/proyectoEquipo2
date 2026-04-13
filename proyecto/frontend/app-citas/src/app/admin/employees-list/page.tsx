"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Briefcase,
  ChevronRight,
  Mail
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Employee {
  id: number;
  branch_id: number;
  full_name: string;
  specialty: string;
  is_active: number;
}

interface Branch {
  id: number;
  name: string;
}

export default function ListaEmpleadoPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const businessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtra por nombre o especialidad (case-insensitive)
  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      emp.full_name?.toLowerCase().includes(q) ||
      emp.specialty?.toLowerCase().includes(q)
    );
  });

  const getEmployees = async () => {
    if (!selectedBranchId || !accessToken) return;

    const resullt = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/branch/${selectedBranchId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })
    const { data } = await resullt.json();
    const formattedData = data.map((employee: Employee) => ({
      id: employee.id,
      full_name: employee.full_name,
      specialty: employee.specialty,
      is_active: employee.is_active
    }));
    setEmployees(formattedData);
  }

  const getBranches = async () => {
    if (!businessId || !accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/business/${businessId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      const { data } = await response.json();
      const list: Branch[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setBranches(list);

      if (list.length > 0) {
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
    if (businessId && accessToken) {
      getBranches();
    }
  }, [businessId, accessToken])

  useEffect(() => {
    if (selectedBranchId && accessToken) {
      getEmployees();
      if (typeof window !== "undefined") {
        localStorage.setItem("adminActiveBranchId", selectedBranchId);
      }
    }
  }, [selectedBranchId, accessToken])

  const deleteEmployee = async (id: number) => {
    try {
      const resullt = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      })
      if (resullt.ok) {
        getEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#fdfaf5] font-sans">
      <Sidebar />

      <section className="flex-1 p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Gestión de Equipo</h1>
            <p className="text-[#666] mt-1">Administra los accesos y roles de tus colaboradores.</p>
          </div>
          <Link
            href="/admin/new-employee"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Agregar Empleado
          </Link>
        </header>

        <div className="max-w-md mb-6">
          <label className="text-sm font-semibold text-[#171717] block mb-2">Sucursal activa</label>
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white text-sm"
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

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border border-black/5 rounded-xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredEmployees.length === 0 ? (
            <p className="text-[#666] text-sm py-6 text-center">
              {searchQuery ? `Sin resultados para "${searchQuery}"` : "No hay empleados registrados."}
            </p>
          ) : (
            filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="group bg-white rounded-4xl p-5 border border-black/5 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0 border-2 border-white shadow-sm">
                  {emp.full_name.charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#171717]">{emp.full_name}</h3>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${emp.is_active === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {emp.is_active === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-[#666]">
                    <p className="flex items-center justify-center md:justify-start gap-1">
                      <Briefcase size={14} className="text-blue-500" /> {emp.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/employees-list/${emp.id}`)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                    title="Editar perfil"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    onClick={() => deleteEmployee(emp.id)}
                    title="Eliminar empleado"
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