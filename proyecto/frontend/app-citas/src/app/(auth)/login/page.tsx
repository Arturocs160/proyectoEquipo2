"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { userLoginSchema, type LoginInput } from "@/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    const resultValidation = userLoginSchema.safeParse({ email, password });

    if (!resultValidation.success) {
      const formattedErrors: Partial<Record<keyof LoginInput, string>> = {};
      resultValidation.error.issues.forEach((err) => {
        const path = err.path[0] as keyof LoginInput;
        if (!formattedErrors[path]) {
          formattedErrors[path] = err.message;
        }
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

    if (result?.ok) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="login-container">
      <Link href="/" className="back-link">
        ← Volver
      </Link>

      <div className="logo" aria-hidden="true">Logo</div>
      <h1 className="titulo">Iniciar Sesión</h1>
      <p className="subtitulo">Accede a tu cuenta para organizar tu agenda.</p>

      <div aria-live="polite" className="mb-6">
        {serverError && (
          <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">!</span>
            <p>{serverError}</p>
          </div>
        )}
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">
          Correo Electrónico <span className="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          ref={emailRef}
          placeholder="tuemail@gmail.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className={fieldErrors.email ? "border-red-500 ring-1 ring-red-500" : ""}
        />
        {fieldErrors.email && (
          <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.email}</p>
        )}

        <label htmlFor="password" className="mt-4 block">
          Contraseña <span className="required">*</span>
        </label>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className={fieldErrors.password ? "border-red-500 ring-1 ring-red-500" : ""}
        />
        {fieldErrors.password && (
          <p className="text-red-600 text-xs mt-1 font-medium">{fieldErrors.password}</p>
        )}

        <p className="registro-link mt-4 text-sm">
          ¿No tienes cuenta? <Link href="/register" className="text-blue-600 hover:underline">Regístrate</Link>
        </p>

        <p className="registro-link mt-4 text-sm">
          ¿Olvidaste tu contraseña? <Link href="/reset-password" className="text-blue-600 hover:underline">Restablecer contraseña</Link>
        </p>

        <button
          type="submit"
          className="entrar-btn mt-6"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}