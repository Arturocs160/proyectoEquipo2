import { render, screen } from "@testing-library/react";
import RegistroPage from "./page";

// Mock de useRouter
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("RegistroPage", () => {
    test("renderiza título y subtítulo", () => {
        render(<RegistroPage />);
        expect(
            screen.getByRole("heading", { name: /crea tu cuenta/i })
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Comienza a organizar tu agenda/i)
        ).toBeInTheDocument();
    });

    test("tiene campos de nombre, correo, contraseña y teléfono", () => {
        render(<RegistroPage />);
        expect(screen.getByPlaceholderText(/juan pérez/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/juan@gmail\.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/\+52\.\.\./i)).toBeInTheDocument();
    });

    test("renderiza enlace de login", () => {
        render(<RegistroPage />);
        const link = screen.getByText(/inicia sesión aquí/i);
        expect(link).toHaveAttribute("href", "/login");
    });

    test("renderiza botón de crear cuenta", () => {
        render(<RegistroPage />);
        expect(
            screen.getByRole("button", { name: /crear mi cuenta gratuita/i })
        ).toBeInTheDocument();
    });
});