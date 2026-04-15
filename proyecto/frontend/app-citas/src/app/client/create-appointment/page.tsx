"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, isBefore, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";

interface BusinessHour {
  day_of_week: number;
  isActive: boolean;
}

interface Branch {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  full_name: string;
  is_active: number;
}

function AgendarPageContent() {
  const searchParams = useSearchParams();

  const businessId = searchParams.get("businessId") || "";
  const serviceId = searchParams.get("serviceId") || "";
  const serviceName = searchParams.get("serviceName") || "Servicio";
  const duration = searchParams.get("duration") || "";
  const price = searchParams.get("price") || "";
  const slug = searchParams.get("slug") || "";
  const branchIdParam = searchParams.get("branchId") || "";
  const employeeIdParam = searchParams.get("employeeId") || "";

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [branchId, setBranchId] = useState("");

  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [disabledDates, setDisabledDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      if (!businessId || !serviceId) {
        setError("Falta contexto de negocio o servicio");
        setLoadingConfig(false);
        return;
      }

      try {
        setLoadingConfig(true);
        setError("");

        const [branchesRes, hoursRes, disabledRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches/business/${businessId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours/${businessId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/disabled-dates/${businessId}`),
        ]);

        const branchesPayload = await branchesRes.json();
        const hoursPayload = await hoursRes.json();
        const disabledPayload = await disabledRes.json();

        const branchList: Branch[] = (Array.isArray(branchesPayload?.data) ? branchesPayload.data : []).map((item: any) => ({
          id: item.id,
          name: item.name,
        }));
        setBranches(branchList);

        const firstBranch = branchList[0];
        if (firstBranch?.id) {
          const branchIdValue =
            branchIdParam && branchList.some((branch) => String(branch.id) === String(branchIdParam))
              ? String(branchIdParam)
              : String(firstBranch.id);
          setBranchId(branchIdValue);
        }

        const mappedHours: BusinessHour[] = (Array.isArray(hoursPayload?.data) ? hoursPayload.data : []).map((row: any) => ({
          day_of_week: Number(row.day_of_week),
          isActive: Boolean(row.isActive),
        }));
        setHours(mappedHours);

        const closed = (Array.isArray(disabledPayload?.data) ? disabledPayload.data : []).map((row: any) => row.date);
        setDisabledDates(closed);
      } catch (requestError) {
        setError("No fue posible obtener configuracion de disponibilidad");
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, [businessId, serviceId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!branchId) {
        setEmployees([]);
        setSelectedEmployeeId("");
        return;
      }

      try {
        const employeesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/branch/${branchId}`);
        const employeesPayload = await employeesRes.json();
        const activeEmployees: Employee[] = (Array.isArray(employeesPayload?.data) ? employeesPayload.data : []).filter(
          (employee: any) => Number(employee.is_active) === 1
        );

        setEmployees(activeEmployees);

        if (employeeIdParam && activeEmployees.some((employee) => String(employee.id) === String(employeeIdParam))) {
          setSelectedEmployeeId(String(employeeIdParam));
        } else {
          setSelectedEmployeeId(activeEmployees[0] ? String(activeEmployees[0].id) : "");
        }
      } catch (error) {
        setEmployees([]);
        setSelectedEmployeeId("");
      }
    };

    fetchEmployees();
  }, [branchId, employeeIdParam]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !businessId || !serviceId || !branchId || !selectedEmployeeId) {
        setAvailableTimes([]);
        setSelectedTime("");
        return;
      }

      try {
        setLoadingAvailability(true);
        const date = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments/availability?businessId=${businessId}&serviceId=${serviceId}&branchId=${branchId}&employeeId=${selectedEmployeeId}&date=${date}`
        );
        const payload = await response.json();
        const slots = Array.isArray(payload?.data?.slots) ? payload.data.slots : [];

        if (!branchId && payload?.data?.branchId) {
          setBranchId(String(payload.data.branchId));
        }

        const now = new Date();
        const isToday = format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
        const filtered = isToday
          ? slots.filter((slot: string) => {
              const [hh, mm] = slot.split(":").map(Number);
              const slotDate = new Date(selectedDate);
              slotDate.setHours(hh, mm, 0, 0);
              return slotDate > now;
            })
          : slots;

        setAvailableTimes(filtered);
        setSelectedTime(filtered[0] || "");
      } catch (requestError) {
        setAvailableTimes([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, businessId, serviceId, branchId, selectedEmployeeId]);

  const disabledWeekDays = useMemo(() => {
    const activeSet = new Set(hours.filter((hour) => hour.isActive).map((hour) => hour.day_of_week));
    const all = [0, 1, 2, 3, 4, 5, 6];
    return all.filter((day) => !activeSet.has(day));
  }, [hours]);

  const disabledDayMatcher = useMemo(
    () => ({
      dayOfWeek: disabledWeekDays,
    }),
    [disabledWeekDays]
  );

  const disabledDateMatcher = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return disabledDates.includes(dateStr);
  };

  const backHref = `/client/list-services?businessId=${businessId}&slug=${encodeURIComponent(slug)}`;

  const continueHref = selectedDate && selectedTime
    ? `/client/client-data?businessId=${businessId}&serviceId=${serviceId}&employeeId=${selectedEmployeeId}&employeeName=${encodeURIComponent(
        employees.find((employee) => String(employee.id) === selectedEmployeeId)?.full_name || ""
      )}&branchId=${branchId}&day=${format(
        selectedDate,
        "yyyy-MM-dd"
      )}&hour=${selectedTime}&serviceName=${encodeURIComponent(serviceName)}&price=${encodeURIComponent(price)}&slug=${encodeURIComponent(
        slug
      )}`
    : "#";

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-6 font-sans relative pb-16">
      <Link
        href={backHref}
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

      {(loadingConfig || error) && (
        <div className="max-w-4xl mx-auto mb-6">
          {loadingConfig && <p className="text-[#666] font-medium">Cargando disponibilidad...</p>}
          {!loadingConfig && error && <p className="text-red-600 font-medium">{error}</p>}
        </div>
      )}

      {!loadingConfig && !error && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarIcon size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#171717]">Selecciona el dia</h2>
              </div>

              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  disabled={[
                    (date) => isBefore(startOfDay(date), startOfDay(new Date())),
                    disabledDayMatcher,
                    disabledDateMatcher,
                  ]}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: "#2563eb",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                  className="border-none"
                />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-blue-900/5">
              <div className="mb-6">
                <label className="text-sm font-semibold text-[#171717] block mb-2">Sucursal</label>
                <select
                  value={branchId}
                  onChange={(event) => setBranchId(event.target.value)}
                  className="w-full h-11 px-3 border border-black/10 rounded-xl bg-white outline-none focus:border-blue-600"
                >
                  {branches.length === 0 ? (
                    <option value="">No hay sucursales</option>
                  ) : (
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-[#171717] block mb-2">Empleado</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(event) => setSelectedEmployeeId(event.target.value)}
                  className="w-full h-11 px-3 border border-black/10 rounded-xl bg-white outline-none focus:border-blue-600"
                >
                  {employees.length === 0 ? (
                    <option value="">No hay empleados activos</option>
                  ) : (
                    employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.full_name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <h2 className="text-xl font-bold text-[#171717]">Horarios disponibles</h2>
              </div>

              {loadingAvailability ? (
                <p className="text-[#666] text-sm">Consultando horarios...</p>
              ) : !branchId ? (
                <p className="text-[#666] text-sm">Selecciona una sucursal para ver horarios disponibles.</p>
              ) : !selectedEmployeeId ? (
                <p className="text-[#666] text-sm">Selecciona un empleado para ver horarios disponibles.</p>
              ) : availableTimes.length === 0 ? (
                <p className="text-[#666] text-sm">No hay horarios disponibles para el dia seleccionado.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                        selectedTime === time
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                          : "bg-gray-50 text-[#666] hover:bg-blue-50 hover:text-blue-600 border border-black/5"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-blue-900/5 overflow-hidden sticky top-24">
              <div className="bg-blue-600 p-8 text-white">
                <h2 className="text-2xl font-bold">Tu Seleccion</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-[#171717] font-semibold">{serviceName}</p>
                  <p className="text-sm text-[#666]">Duracion: {duration ? `${duration} min` : "No definida"}</p>
                  <p className="text-sm text-[#666]">Precio: {price ? `$${price}` : "Por definir"}</p>
                  <p className="text-sm text-[#666]">
                    Sucursal: {branches.find((branch) => String(branch.id) === branchId)?.name || "Sin seleccionar"}
                  </p>
                  <p className="text-sm text-[#666]">
                    Empleado: {employees.find((employee) => String(employee.id) === selectedEmployeeId)?.full_name || "Sin seleccionar"}
                  </p>
                  <div className="flex items-start gap-3">
                    <CalendarIcon size={18} className="text-blue-600 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dia y Hora</p>
                      <p className="text-[#171717] font-bold">{selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Sin dia"}</p>
                      <p className="text-blue-600 text-sm font-bold">{selectedTime || "Sin horario"}</p>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-black/5 w-full" />

                <Link
                  href={continueHref}
                  className={`w-full text-white font-bold text-lg px-6 h-16 rounded-2xl transition-all flex items-center justify-center gap-2 group ${
                    selectedDate && selectedTime
                      ? "bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                      : "bg-gray-300 pointer-events-none"
                  }`}
                >
                  Continuar con mis datos
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default function AgendarPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 font-sans">
          <p className="text-[#666] font-medium">Cargando disponibilidad...</p>
        </main>
      }
    >
      <AgendarPageContent />
    </Suspense>
  );
}
