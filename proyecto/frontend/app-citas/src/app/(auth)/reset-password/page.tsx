"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { userResetPasswordSchema, type ResetPasswordInput, forgotPassword } from "@/features/auth";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default function ResetPasswordPage() {
    const emailRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldError, setFieldError] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldError({});

        const resultValidation = userResetPasswordSchema.safeParse({ email });

        if (!resultValidation.success) {
            const formattedErrors: Partial<Record<keyof ResetPasswordInput, string>> = {};
            resultValidation.error.issues.forEach((err) => {
                const path = err.path[0] as keyof ResetPasswordInput;
                if (!formattedErrors[path]) formattedErrors[path] = err.message;
            });
            setFieldError(formattedErrors);
            return;
        }

        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess("Si el correo está registrado, recibirás un enlace pronto.");
            setEmail("");
        } catch (err) {
            setError("Ocurrió un error al intentar enviar el correo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6 font-sans relative">

            <Link
                href="/login"
                className="absolute top-8 left-8 flex items-center gap-2 text-[#171717] font-medium hover:text-blue-600 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver al login
            </Link>

            <div className="w-full max-w-[440px] bg-white rounded-4xl shadow-xl shadow-blue-900/5 border border-black/5 p-10">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#171717] tracking-tight">Recuperar contraseña</h1>
                    <p className="text-[#666] mt-2">Te enviaremos un enlace para que puedas restablecer tu acceso.</p>
                </div>

                <div aria-live="polite" className="mb-6 space-y-3">
                    {error && (
                        <div role="alert" className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-sm animate-in fade-in zoom-in-95">
                            <AlertCircle size={18} className="text-red-600 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div role="status" className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm animate-in fade-in zoom-in-95">
                            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                            <p>{success}</p>
                        </div>
                    )}
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-[#171717] ml-1">
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                ref={emailRef}
                                placeholder="tuemail@gmail.com"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full h-12 pl-4 pr-10 border rounded-xl text-base bg-white outline-none transition-all focus:ring-4 focus:ring-blue-600/10 ${fieldError.email ? "border-red-500 ring-red-100" : "border-black/10 focus:border-blue-600"
                                    }`}
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        {fieldError.email && (
                            <p className="text-red-600 text-xs font-medium ml-1">{fieldError.email}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white h-14 rounded-xl text-base font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Enviar enlace de recuperación"
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-[#666]">
                            ¿Recordaste tu contraseña?{" "}
                            <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}