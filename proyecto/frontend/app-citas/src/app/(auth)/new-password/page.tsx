"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import { newPasswordSchema, type NewPasswordInput, resetPassword } from "@/features/auth";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Lock, EyeOff, Eye } from "lucide-react";

function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof NewPasswordInput, string>>>({});

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    if (!id || !token) {
      setServerError("Enlace inválido o expirado. Por favor, solicita uno nuevo.");
      return;
    }

    const resultValidation = newPasswordSchema.safeParse({ password, confirmPassword });

    if (!resultValidation.success) {
      const formattedErrors: Partial<Record<keyof NewPasswordInput, string>> = {};
      resultValidation.error.issues.forEach((err) => {
        const path = err.path[0] as keyof NewPasswordInput;
        if (!formattedErrors[path]) formattedErrors[path] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(id, token, resultValidation.data.password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setServerError(err.message || "Error inesperado. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#171717] mb-3">¡Contraseña Actualizada!</h2>
        <p className="text-[#666] mb-8">Tu seguridad es nuestra prioridad. Tu contraseña ha sido restablecida correctamente.</p>
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <Loader2 className="animate-spin" size={16} />
          Redirigiendo al inicio de sesión...
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al login
      </Link>

      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Nueva Contraseña</h1>
        <p className="text-[#666] mt-2">Ingresa tu nueva clave para recuperar el acceso a tu cuenta.</p>
      </div>

      <div aria-live="polite" className="mb-6">
        {serverError && (
          <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {(!id || !token) && (
          <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl text-sm leading-relaxed mb-2">
            <strong>Atención:</strong> No se detectaron los parámetros de seguridad necesarios. Asegúrate de abrir el enlace directamente desde tu correo.
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-[#171717] ml-1">
            Nueva Contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              ref={passwordRef}
              placeholder="NuevaClave123!"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full h-12 pl-4 pr-10 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.password ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                }`}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.password}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#171717] ml-1">
            Confirmar Contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              required
              aria-label="Confirmar contraseña"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full h-12 pl-4 pr-10 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.confirmPassword ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                }`}
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !id || !token}
          className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Restablecer Contraseña"}
        </button>
      </form>
    </>
  );
}

export default function NewPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6 font-sans relative">
      <div className="w-full max-w-[440px] bg-white rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 p-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="mt-4 text-[#666] font-medium animate-pulse">Verificando sesión...</p>
          </div>
        }>
          <NewPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}