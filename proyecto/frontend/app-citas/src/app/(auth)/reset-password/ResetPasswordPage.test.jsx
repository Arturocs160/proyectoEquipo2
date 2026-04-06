import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPasswordPage from "./page"; // Ajusta la ruta a tu archivo
import { forgotPassword, userResetPasswordSchema } from "@/features/auth";

// 1. Mockeamos las dependencias de la capa de autenticación
jest.mock("@/features/auth", () => ({
    forgotPassword: jest.fn(),
    userResetPasswordSchema: {
        safeParse: jest.fn(),
    },
}));

// Mock de Next/Link para que funcione en el entorno de Node/Jest
jest.mock("next/link", () => {
    return ({ children, href }) => <a href={href}>{children}</a>;
});

describe("ResetPasswordPage (Jest + JSX)", () => {

    beforeEach(() => {
        // Limpiamos los mocks antes de cada test para evitar interferencias
        jest.clearAllMocks();
    });

    it("debe renderizar el formulario correctamente", () => {
        render(<ResetPasswordPage />);

        expect(screen.getByText(/Recuperar contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Enviar enlace/i })).toBeInTheDocument();
    });

    it("debe mostrar error de validación cuando el email no cumple el esquema", async () => {
        // Simulamos fallo de validación de Zod
        userResetPasswordSchema.safeParse.mockReturnValue({
            success: false,
            error: {
                issues: [{ path: ["email"], message: "Email no válido" }],
            },
        });

        render(<ResetPasswordPage />);

        const input = screen.getByLabelText(/Correo Electrónico/i);
        const button = screen.getByRole("button", { name: /Enviar enlace/i });

        fireEvent.change(input, { target: { value: "error-email" } });
        fireEvent.click(button);

        // Buscamos el mensaje de error específico
        expect(await screen.findByText("Email no válido")).toBeInTheDocument();
        expect(forgotPassword).not.toHaveBeenCalled();
    });

    it("debe mostrar mensaje de éxito y limpiar el input al enviar correctamente", async () => {
        // Simulamos validación exitosa y respuesta positiva de la función
        userResetPasswordSchema.safeParse.mockReturnValue({
            success: true,
            data: { email: "usuario@ejemplo.com" },
        });
        forgotPassword.mockResolvedValueOnce();

        render(<ResetPasswordPage />);

        const input = screen.getByLabelText(/Correo Electrónico/i);
        const button = screen.getByRole("button", { name: /Enviar enlace/i });

        fireEvent.change(input, { target: { value: "usuario@ejemplo.com" } });
        fireEvent.click(button);

        // Verificamos que aparezca el mensaje de éxito
        const successMsg = await screen.findByText(/Si el correo está registrado, recibirás un enlace pronto/i);
        expect(successMsg).toBeInTheDocument();

        // El campo de email debe vaciarse
        expect(input.value).toBe("");
    });

    it("debe mostrar un mensaje de error si la API falla", async () => {
        userResetPasswordSchema.safeParse.mockReturnValue({
            success: true,
            data: { email: "test@error.com" },
        });

        // Simulamos una excepción en la función forgotPassword
        forgotPassword.mockRejectedValueOnce(new Error("Error de conexión"));

        render(<ResetPasswordPage />);

        const button = screen.getByRole("button", { name: /Enviar enlace/i });
        fireEvent.click(button);

        const errorAlert = await screen.findByText(/Ocurrió un error al intentar enviar el correo/i);
        expect(errorAlert).toBeInTheDocument();
    });

    it("debe contener un enlace funcional para volver al login", () => {
        render(<ResetPasswordPage />);

        // Buscamos el enlace por su texto
        const backLink = screen.getByText(/Volver al login/i).closest("a");
        expect(backLink).toHaveAttribute("href", "/login");
    });
});