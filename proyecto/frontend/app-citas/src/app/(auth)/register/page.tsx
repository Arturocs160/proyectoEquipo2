"use client";

import Link from "next/link";
import { registerUser } from "@/features/auth/actions/auth-actions";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { userRegisterSchema, type RegisterInput } from "@/features/auth";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, EyeOff, Eye } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);

  const [full_name, setFull_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const validation = userRegisterSchema.safeParse({ full_name, email, password, phone });

    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof RegisterInput, string>> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as keyof RegisterInput;
        if (!formattedErrors[path]) formattedErrors[path] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setLoading(true);
    const userRole = "owner";

    try {
      const result = await registerUser(
        validation.data.full_name,
        validation.data.email,
        validation.data.password,
        userRole,
        validation.data.phone
      );

      if (result.statusCode === 201) {
        setSuccess("¡Usuario registrado exitosamente! Redirigiendo...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(result.data.message || "Error al registrar");
        nameRef.current?.focus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6 font-sans relative">

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[480px] bg-white rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 p-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Crea tu cuenta</h1>
          <p className="text-[#666] mt-2">Comienza a organizar tu agenda hoy mismo.</p>
        </div>

        {/* Mensajes de estado */}
        <div aria-live="polite" className="mb-6 space-y-3">
          {error && (
            <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm animate-in fade-in zoom-in-95">
              <AlertCircle size={18} className="text-red-600" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div role="status" className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm animate-in fade-in zoom-in-95">
              <CheckCircle2 size={18} className="text-green-600" />
              <p>{success}</p>
            </div>
          )}
        </div>

        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit} noValidate>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="full_name" className="text-sm font-semibold text-[#171717] ml-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              id="full_name"
              ref={nameRef}
              type="text"
              placeholder="Juan Pérez"
              className={`h-12 px-4 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.full_name ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                }`}
              onChange={(e) => setFull_name(e.target.value)}
            />
            {fieldErrors.full_name && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.full_name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="juan@gmail.com"
              className={`h-12 px-4 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.email ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                }`}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-[#171717] ml-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className={`w-full h-12 px-4 pr-12 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.password ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                    }`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                  className="absolute right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-[#171717] ml-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+52..."
                className={`h-12 px-4 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.phone ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                  }`}
                onChange={(e) => setPhone(e.target.value)}
              />
              {fieldErrors.phone && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.phone}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Crear mi cuenta gratuita"}
          </button>

          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="h-px w-full bg-black/5" />
            <p className="text-sm text-[#666]">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}