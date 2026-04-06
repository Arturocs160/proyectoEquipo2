import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
    useSession: jest.fn(),
}));

jest.mock("next/link", () => {
    return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock("../../../components/Logo", () => {
    return () => <div data-testid="mock-logo">Logo</div>;
});

describe("LoginPage Component", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue({ push: mockPush });
        useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    });

    it("debe renderizar el formulario correctamente", () => {
        render(<LoginPage />);
        expect(screen.getByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /entrar a mi cuenta/i })).toBeInTheDocument();
    });

    it("debe redirigir al dashboard si el usuario ya tiene sesion activa", () => {
        useSession.mockReturnValue({ data: { user: { email: "admin@test.com" } }, status: "authenticated" });
        render(<LoginPage />);

        expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });

    it("debe llamar a signIn y redirigir al enviar credenciales correctas", async () => {
        signIn.mockResolvedValueOnce({ ok: true, error: null });
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        const submitButton = screen.getByRole("button", { name: /entrar a mi cuenta/i });

        await userEvent.type(emailInput, "admin@empresa.com");
        await userEvent.type(passwordInput, "Password123!");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith("credentials", {
                email: "admin@empresa.com",
                password: "Password123!",
                redirect: false,
            });
        });

        expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
    });

    it("debe mostrar un mensaje de error del servidor si las credenciales son invalidas", async () => {
        signIn.mockResolvedValueOnce({ ok: false, error: "CredentialsSignin" });
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/^contraseña/i);
        const submitButton = screen.getByRole("button", { name: /entrar a mi cuenta/i });

        await userEvent.type(emailInput, "admin@empresa.com");
        await userEvent.type(passwordInput, "MalPassword1!");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Credenciales inválidas. Inténtalo de nuevo.")).toBeInTheDocument();
        });

        expect(mockPush).not.toHaveBeenCalled();
    });
});