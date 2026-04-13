"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Plus,
  Upload,
  Image as ImageIcon,
  Store,
  Phone,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

interface Business {
  id: number;
  owner_id: string;
  slug: string;
  logo_url: string | null;
  name: string;
  specialty: string | null;
  description: string | null;
  location: string | null;
  rating: string | null;
}

interface Branch {
  id: number;
  business_id: number;
  name: string;
  address: string | null;
  phone: string | null;
}

interface Schedule {
  id: number;
  day_of_week: number;
  open: string;
  close: string;
  is_Active: boolean;
  name: string;
}

interface DisabledDate {
  id: number;
  date: string;
  reason: string;
}

const DAYS = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

const defaultSchedule = (): Schedule[] =>
  DAYS.map((name, day) => ({
    id: day,
    day_of_week: day,
    open: "09:00",
    close: "18:00",
    is_Active: day > 0 && day < 6,
    name,
  }));

export default function BusinessInfoPage() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id;
  const sessionBusinessId = session?.user?.businessId;
  const accessToken = session?.user?.accessToken;

  const [business, setBusiness] = useState<Business | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [nameBusiness, setNameBusiness] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [scheduleInfo, setScheduleInfo] = useState<Schedule[]>(defaultSchedule());
  const [disabledDates, setDisabledDates] = useState<DisabledDate[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [newBranchPhone, setNewBranchPhone] = useState("");

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const applyBusinessToForm = (row: Business) => {
    setNameBusiness(row.name || "");
    setSpecialty(row.specialty || "");
    setDescription(row.description || "");
    setLocation(row.location || "");
    setRating(row.rating || "");
    setLogoUrl(row.logo_url || null);
    setLogoFile(null);
  };

  const getBusiness = async () => {
    if (!ownerId || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-info/${ownerId}`, {
        headers: authHeaders,
      });
      const data = await response.json();
      const list: Business[] = Array.isArray(data.data) ? data.data : [];

      if (list.length === 0) {
        setBusiness(null);
        return;
      }

      const selected =
        list.find((item) => String(item.id) === String(sessionBusinessId)) ||
        list[0];

      setBusiness(selected);
      applyBusinessToForm(selected);
    } catch (error) {
      console.error("Error al obtener datos del negocio:", error);
    }
  };

  const getBranches = async (businessId: string) => {
    if (!businessId || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/business/${businessId}`, {
        headers: authHeaders,
      });
      const data = await response.json();
      const list: Branch[] = Array.isArray(data.data) ? data.data : [];
      setBranches(list);
    } catch (error) {
      console.error("Error al obtener sucursales:", error);
      setBranches([]);
    }
  };

  const getSchedule = async (businessId: string) => {
    if (!businessId || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours/${businessId}`, {
        headers: authHeaders,
      });
      const data = await response.json();
      const rows = Array.isArray(data.data) ? data.data : [];

      const map = new Map<number, Schedule>();
      rows.forEach((item: any) => {
        const day = Number(item.day_of_week);
        map.set(day, {
          id: item.id,
          day_of_week: day,
          open: item.open || "",
          close: item.close || "",
          is_Active: Boolean(item.isActive !== undefined ? item.isActive : item.is_active),
          name: item.name || DAYS[day],
        });
      });

      const fullWeek = DAYS.map((dayName, day) =>
        map.get(day) || {
          id: day,
          day_of_week: day,
          open: "09:00",
          close: "18:00",
          is_Active: day > 0 && day < 6,
          name: dayName,
        }
      );

      setScheduleInfo(fullWeek);
    } catch (error) {
      console.error("Error al obtener horario:", error);
      setScheduleInfo(defaultSchedule());
    }
  };

  const getDisabledDates = async (businessId: string) => {
    if (!businessId || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disabled-dates/${businessId}`, {
        headers: authHeaders,
      });
      const data = await response.json();
      const formatted: DisabledDate[] = (Array.isArray(data.data) ? data.data : []).map((item: any) => ({
        id: item.id,
        date: item.date,
        reason: item.reason,
      }));
      setDisabledDates(formatted);
    } catch (error) {
      console.error("Error al obtener fechas deshabilitadas:", error);
      setDisabledDates([]);
    }
  };

  useEffect(() => {
    getBusiness();
  }, [ownerId, accessToken, sessionBusinessId]);

  useEffect(() => {
    if (!business) return;
    const id = String(business.id);
    getBranches(id);
    getSchedule(id);
    getDisabledDates(id);
  }, [business?.id]);

  const appendOptionalText = (formData: FormData, key: string, value: string) => {
    const normalized = value.trim();
    if (normalized.length > 0) {
      formData.append(key, normalized);
    }
  };

  const handleCreateBranch = async () => {
    if (!business || !accessToken) return;
    if (!newBranchName.trim() || !newBranchAddress.trim() || !newBranchPhone.trim()) {
      alert("Completa nombre, direccion y telefono de la sucursal");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: String(business.id),
          name: newBranchName.trim(),
          address: newBranchAddress.trim(),
          phone: newBranchPhone.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "No se pudo crear la sucursal");
      }

      setNewBranchName("");
      setNewBranchAddress("");
      setNewBranchPhone("");
      await getBranches(String(business.id));
      alert("Sucursal creada correctamente");
    } catch (error: any) {
      console.error("Error al crear sucursal:", error);
      alert(error?.message || "No fue posible crear la sucursal");
    }
  };

  const handleDeleteBranch = async (id: number) => {
    if (!accessToken || !business) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "No se pudo eliminar la sucursal");
      }

      await getBranches(String(business.id));
      alert("Sucursal eliminada");
    } catch (error: any) {
      console.error("Error al eliminar sucursal:", error);
      alert(error?.message || "No fue posible eliminar la sucursal");
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const updateSchedule = async (businessId: string) => {
    if (!accessToken || scheduleInfo.length === 0) return;

    const promises = scheduleInfo.map((day) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours/upsert`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          dayOfWeek: day.day_of_week,
          openTime: day.open,
          closeTime: day.close,
          isActive: day.is_Active,
        }),
      })
    );

    await Promise.all(promises);
  };

  const updateBusiness = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!business || !accessToken) {
      alert("No se encontro el negocio activo");
      return;
    }

    if (!nameBusiness.trim()) {
      alert("El nombre del negocio es obligatorio");
      return;
    }

    const businessId = String(business.id);
    const formData = new FormData();
    formData.append("name", nameBusiness.trim());
    appendOptionalText(formData, "specialty", specialty);
    appendOptionalText(formData, "description", description);
    appendOptionalText(formData, "location", location);
    appendOptionalText(formData, "rating", rating);

    if (logoFile) {
      formData.append("logo", logoFile);
    } else {
      formData.append("logo_url", logoUrl || "");
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-info/business/${businessId}`, {
        method: "PUT",
        headers: authHeaders,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "No fue posible actualizar el negocio");
      }

      await updateSchedule(businessId);
      await getBusiness();
      await getSchedule(businessId);
      setLogoFile(null);
      alert("Cambios guardados correctamente");
    } catch (error: any) {
      console.error("Error al actualizar negocio u horarios:", error);
      alert(error?.message || "Hubo un problema al guardar los cambios");
    }
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: string | boolean | number) => {
    const updated = [...scheduleInfo];
    updated[index] = { ...updated[index], [field]: value } as Schedule;
    setScheduleInfo(updated);
  };

  const handleAddDisabledDate = async () => {
    if (!newDate || !business || !accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disabled-dates`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: String(business.id),
          closedDate: newDate,
          reason: newReason || "Sin especificar",
        }),
      });
      const data = await response.json();
      if (data.success || response.ok) {
        await getDisabledDates(String(business.id));
        setNewDate("");
        setNewReason("");
        alert("Fecha deshabilitada agregada");
      }
    } catch (error) {
      console.error("Error al agregar fecha deshabilitada:", error);
      alert("Hubo un problema al agregar la fecha");
    }
  };

  const handleRemoveDisabledDate = async (id: number) => {
    if (!accessToken || !business) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disabled-dates/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();
      if (data.success || response.ok) {
        await getDisabledDates(String(business.id));
        alert("Fecha deshabilitada eliminada");
      }
    } catch (error) {
      console.error("Error al eliminar fecha deshabilitada:", error);
      alert("Hubo un problema al eliminar la fecha");
    }
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
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Negocio y Sucursales</h1>
          <p className="text-[#666] mt-1">Configura la informacion del negocio y administra sus sucursales.</p>
        </header>

        {!business ? (
          <p className="text-[#666]">No se encontro un negocio para tu cuenta.</p>
        ) : (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#171717] mb-4">Sucursales del negocio</h2>

              {branches.length === 0 ? (
                <p className="text-sm text-[#666] mb-4">Aun no tienes sucursales registradas.</p>
              ) : (
                <div className="space-y-3 mb-5">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50 border border-black/5 rounded-xl p-4"
                    >
                      <div>
                        <p className="font-bold text-[#171717] flex items-center gap-2">
                          <Store size={16} className="text-blue-600" />
                          {branch.name}
                        </p>
                        <p className="text-sm text-[#666] mt-1 flex items-center gap-2">
                          <MapPin size={14} /> {branch.address || "Sin direccion"}
                        </p>
                        <p className="text-sm text-[#666] mt-1 flex items-center gap-2">
                          <Phone size={14} /> {branch.phone || "Sin telefono"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="self-start md:self-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2 inline-flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-black/5 pt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nombre de sucursal"
                  value={newBranchName}
                  onChange={(event) => setNewBranchName(event.target.value)}
                  className="h-11 px-3 border border-black/10 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Direccion"
                  value={newBranchAddress}
                  onChange={(event) => setNewBranchAddress(event.target.value)}
                  className="h-11 px-3 border border-black/10 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Telefono"
                  value={newBranchPhone}
                  onChange={(event) => setNewBranchPhone(event.target.value)}
                  className="h-11 px-3 border border-black/10 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleCreateBranch}
                  className="md:col-span-3 h-11 rounded-lg bg-[#171717] text-white font-semibold hover:bg-black inline-flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Agregar sucursal
                </button>
              </div>
            </div>

            <form onSubmit={updateBusiness} className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-blue-900/5 p-10">
              <div className="mb-10 flex flex-col items-center sm:flex-row sm:items-start gap-6 border-b border-black/5 pb-8">
                <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 transition-colors">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo del negocio" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                  )}

                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white mb-1" size={24} />
                    <span className="text-white text-xs font-semibold">{logoUrl ? "Cambiar" : "Subir"}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleLogoChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left mt-2">
                  <h3 className="text-lg font-bold text-[#171717]">Logo del Negocio</h3>
                  <p className="text-sm text-[#666] mt-1 max-w-sm">
                    Sube el logotipo de tu empresa. Recomendamos una imagen cuadrada (512x512px) en formato PNG, JPG o WEBP.
                  </p>
                </div>
              </div>

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
                      value={nameBusiness}
                      onChange={(event) => setNameBusiness(event.target.value)}
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
                      value={specialty}
                      onChange={(event) => setSpecialty(event.target.value)}
                      className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="descripcion" className="text-sm font-semibold text-[#171717] ml-1">
                    Descripcion
                  </label>
                  <div className="relative">
                    <textarea
                      id="descripcion"
                      rows={4}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="w-full p-4 pl-11 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                    ></textarea>
                    <AlignLeft className="absolute left-3.5 top-4 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Contacto y Ubicacion</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label htmlFor="ubicacion" className="text-sm font-semibold text-[#171717] ml-1">
                    Direccion principal
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="ubicacion"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label htmlFor="rating" className="text-sm font-semibold text-[#171717] ml-1">
                    Calificacion (opcional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="rating"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      className="w-full h-12 pl-11 pr-4 border border-black/10 rounded-xl text-base bg-white outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                    <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Horario de Atencion</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-black/5 mb-10">
                <div className="text-sm text-[#666] mb-6 flex items-center gap-2">
                  <Clock size={16} /> Configura los dias y horas exactas para el negocio.
                </div>
                <div className="flex flex-col gap-4">
                  {scheduleInfo.map((day, index) => (
                    <div key={`${day.day_of_week}-${day.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-black/5 shadow-sm">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={day.is_Active}
                            onChange={(event) => handleScheduleChange(index, "is_Active", event.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                        <span className={`font-bold w-24 ${day.is_Active ? "text-[#171717]" : "text-gray-400"}`}>{day.name}</span>
                      </div>

                      <div className={`flex items-center gap-3 ${!day.is_Active ? "opacity-50 pointer-events-none" : ""}`}>
                        <input
                          type="time"
                          value={day.open}
                          onChange={(event) => handleScheduleChange(index, "open", event.target.value)}
                          className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-blue-600 bg-white"
                        />
                        <span className="text-[#666]">-</span>
                        <input
                          type="time"
                          value={day.close}
                          onChange={(event) => handleScheduleChange(index, "close", event.target.value)}
                          className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold text-[#171717] mb-8 border-b border-black/5 pb-4 mt-8">Dias Feriados o Cerrados</h2>
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 mb-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarX size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#171717] mb-1">Restriccion de Fechas</h3>
                    <p className="text-sm text-[#666]">Bloquea fechas especificas para que nadie pueda agendar en esos dias.</p>
                  </div>
                </div>

                {disabledDates.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {disabledDates.map((dd) => (
                      <div key={dd.id} className="bg-white border border-orange-200 shadow-sm rounded-lg py-2 px-3 flex items-center gap-3">
                        <div>
                          <span className="font-bold text-sm text-[#171717] block">{dd.date}</span>
                          <span className="text-xs text-[#666]">{dd.reason}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDisabledDate(dd.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-white p-4 rounded-xl border border-orange-100 flex flex-col md:flex-row gap-4 items-end shadow-sm">
                  <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
                    <label className="text-xs font-semibold text-[#171717]">Fecha a bloquear</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(event) => setNewDate(event.target.value)}
                      className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-orange-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full md:w-auto flex-1">
                    <label className="text-xs font-semibold text-[#171717]">Motivo (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Ano Nuevo"
                      value={newReason}
                      onChange={(event) => setNewReason(event.target.value)}
                      className="h-10 px-3 border border-black/10 rounded-lg outline-none focus:border-orange-500 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDisabledDate}
                    className="w-full md:w-auto h-10 px-4 bg-orange-100 text-orange-600 font-bold rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                  >
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
        )}
      </section>
    </main>
  );
}
