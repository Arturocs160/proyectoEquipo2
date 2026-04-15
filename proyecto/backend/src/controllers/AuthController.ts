import AuthModel from "../models/AuthModel";
import AuthService from "../services/AuthService";
import { Request, Response } from "express";

class AuthController {

    static async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const result = await AuthService.login(email, password);

            if (!result) {
                response.status(401).json({ message: "Crendenciales inválidas" });
                return;
            }

            response.status(200).json({ message: "Login exitoso", data: result })
        } catch (error) {
            console.error("Error en AuthController.login:", error);
            response.status(500).json({ message: "Error interno del servidor", error });
        }
    }

    static async register(request: Request, response: Response) {
        try {
            const { full_name, email, password, phone } = request.body;

            const user = await AuthModel.getUserByEmail(email);

            if (user.length > 0) {
                response.status(401).json({ message: "El usuario ya existe" });
                return;
            }

            const result = await AuthService.register(full_name, email, password, "owner", phone);

            if (!result) {
                response.status(401).json({ message: "Crendenciales inválidas" });
                return;
            }

            response.status(201).json({ message: "Registro exitoso", data: result })
        } catch (error) {
            console.error("Error en AuthController.register:", error);
            response.status(500).json({ message: "Error interno del servidor", error });
        }
    }

    static async logout(request: Request, response: Response) {
        try {
            const { authorization } = request.headers;

            if (!authorization) {
                response.status(401).json({ message: "No se proporciono un token" })
                return;
            }

            await AuthService.logout(authorization)
            response.status(200).json({ message: "Logout exitoso" })
        } catch (error) {
            console.error("Error en AuthController.logout:", error);
            response.status(500).json({ message: "Error al cerrar sesión" })
        }
    }

    static async forgotPassword(request: Request, response: Response) {
        try {
            const { email } = request.body;
            await AuthService.processForgotPassword(email);

            response.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' });
        } catch (error: any) {
            console.error("Error en AuthController.forgotPassword:", error);
            response.status(400).json({ message: 'Error al procesar la solicitud' });
        }
    }

    static async resetPassword(request: Request, response: Response) {
        try {
            const { id, token, newPassword } = request.body;
            await AuthService.processResetPassword(id, token, newPassword);

            response.status(200).json({ message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.' });
        } catch (error: any) {
            console.error("Error en AuthController.resetPassword:", error);
            response.status(400).json({ message: 'Error al restablecer la contraseña' });
        }
    }
}

export default AuthController;