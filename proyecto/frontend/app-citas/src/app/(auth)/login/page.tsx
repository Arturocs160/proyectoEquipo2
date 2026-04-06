"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { userLoginSchema, type LoginInput } from "@/features/auth";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, AlertCircle, EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      router.push("/admin/dashboard");
    }
  }, [session.data?.user]);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    const resultValidation = userLoginSchema.safeParse({ email, password });

    if (!resultValidation.success) {
      const formattedErrors: Partial<Record<keyof LoginInput, string>> = {};
      resultValidation.error.issues.forEach((err) => {
        const path = err.path[0] as keyof LoginInput;
        if (!formattedErrors[path]) formattedErrors[path] = err.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email: resultValidation.data.email,
      password: resultValidation.data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Credenciales inválidas. Inténtalo de nuevo.");
      setLoading(false);
      emailRef.current?.focus();
      return;
    }

    if (result?.ok) router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center p-6 font-sans relative">

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[440px] bg-white rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 p-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Iniciar Sesión</h1>
          <p className="text-[#666] mt-2">Accede a tu cuenta para organizar tu agenda.</p>
        </div>

        {serverError && (
          <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm mb-6 animate-in fade-in zoom-in-95">
            <AlertCircle size={18} className="text-red-600" />
            <p>{serverError}</p>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              placeholder="tuemail@gmail.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className={`h-12 px-4 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.email ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                }`}
            />
            {fieldErrors.email && <p className="text-red-600 text-xs font-medium ml-1">{fieldErrors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-[#171717] ml-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 px-4 pr-12 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldErrors.password ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                  }`}
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

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar a mi cuenta"}
          </button>

          <div className="flex flex-col items-center gap-3 mt-4">
            <Link href="/reset-password" id="forgot-password-link" className="text-sm text-[#666] hover:text-blue-600 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="h-px w-full bg-black/5 my-1" />
            <p className="text-sm text-[#666]">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}