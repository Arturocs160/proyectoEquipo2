"use client";

import Link from "next/link";
import { registerUser } from "@/features/auth/actions/auth-actions";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { userRegisterSchema, type RegisterInput } from "@/features/auth";

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
    <main className="registro-container">
      <Link href="/" className="volver-link">← Volver</Link>

      <div className="logo" aria-hidden="true">Logo</div>
      <h1 className="titulo">Regístrate</h1>
      <p className="subtitulo">Comienza a organizar tu agenda y profesionaliza tu atención.</p>

      <div aria-live="polite" className="mb-6 space-y-3">
        {error && (
          <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            <span className="font-bold">!</span> <p>{error}</p>
          </div>
        )}
        {success && (
          <div role="status" className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            <span>✓</span> <p>{success}</p>
          </div>
        )}
      </div>

      <form className="registro-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="full_name">Nombre Completo *</label>
        <input
          id="full_name"
          ref={nameRef}
          type="text"
          placeholder="Juan Pérez"
          className={fieldErrors.full_name ? "border-red-500 ring-1 ring-red-500" : ""}
          onChange={(e) => setFull_name(e.target.value)}
        />
        {fieldErrors.full_name && <p className="text-red-600 text-xs mt-1">{fieldErrors.full_name}</p>}

        <label htmlFor="email" className="mt-4 block">Correo Electrónico *</label>
        <input
          id="email"
          type="email"
          placeholder="juan@gmail.com"
          className={fieldErrors.email ? "border-red-500 ring-1 ring-red-500" : ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>}

        <label htmlFor="password" className="mt-4 block">Contraseña *</label>
        <input
          id="password"
          type="password"
          placeholder="********"
          className={fieldErrors.password ? "border-red-500 ring-1 ring-red-500" : ""}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>}

        <label htmlFor="phone" className="mt-4 block">Número telefónico *</label>
        <input
          id="phone"
          type="tel"
          placeholder="+52XXXXXXXXXX"
          className={fieldErrors.phone ? "border-red-500 ring-1 ring-red-500" : ""}
          onChange={(e) => setPhone(e.target.value)}
        />
        {fieldErrors.phone && <p className="text-red-600 text-xs mt-1">{fieldErrors.phone}</p>}

        <p className="login-link mt-4 text-sm">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600">Iniciar Sesión</Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="crear-btn flex items-center justify-center gap-2 mt-6"
        >
          {loading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
      </form>
    </main>
  );
}