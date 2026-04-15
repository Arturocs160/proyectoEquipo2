import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import AuthModel from "../models/AuthModel";
import TokenBlacklistModel from "../models/TokenBlacklistModel";
import { Resend } from "resend";

import "dotenv/config"
import BusinessInfoModel from "../models/BusinessInfoModel";

const resend = new Resend(process.env.RESEND_API_KEY);

const structureEmailHtml = (resetUrl: string) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <title>Restablecer Contrasena</title>
    </head>
    <body style="font-family: sans-serif; background-color: #f4f4f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">
        <h2 style="color: #333333; margin-top: 0;">Restablecimiento de contrasena</h2>
        <p style="color: #555555; font-size: 16px;">Hola,</p>
        <p style="color: #555555; font-size: 16px;">Recibimos una solicitud para restablecer la contrasena de tu cuenta en el sistema de gestion de citas. Si no hiciste esta solicitud, puedes ignorar este correo de forma segura.</p>
        <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Restablecer mi contrasena</a>
        </div>
        <p style="color: #555555; font-size: 14px;">Si el boton no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p style="color: #007bff; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
        <p style="color: #999999; font-size: 12px; text-align: center;">Gestion de Citas &copy; 2026. Todos los derechos reservados.</p>
    </div>
    </body>
    </html>
    `
}

class AuthService {

    static async login(email: string, password: string) {
        const user = await AuthModel.getUserByEmail(email);

        if (user.length === 0) {
            throw new Error("Credenciales inválidas");
        }

        const { id, full_name, role, password: passwordUser, email: userEmail } = user[0];

        const isPasswordValid = await bcrypt.compare(password, passwordUser);

        if (!isPasswordValid) {
            throw new Error("Credenciales inválidas");
        }

        const businessInfo = await AuthModel.getUserById(id);
        console.log("businessInfo query result:", businessInfo);

        const timestamp = Date.now();

        const token = jwt.sign({ id, timestamp }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        // Si no hay información del negocio, permitir el login pero sin businessId
        const businessId = businessInfo && businessInfo.length > 0 && businessInfo[0].businessId 
            ? String(businessInfo[0].businessId) 
            : null;
        
        console.log("Returning businessId:", businessId);

        return { token, id, full_name, email: userEmail, role, businessId };
    }

    static async register(full_name: string, email: string, password: string, role: string, phone: string) {
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const id = randomUUID();


        try {
            const result = await AuthModel.createAccount(id, full_name, email, phone, hashedPassword);
            // console.log(result)

            // Obtener la información del negocio asociado
            const businessInfo = await AuthModel.getUserById(id);

            return {
                id: result[0].id,
                full_name: result[0].full_name,
                email: result[0].email,
                phone: result[0].phone,
                role: result[0].role,
                businessId: businessInfo && businessInfo.length > 0 ? String(businessInfo[0].businessId) : undefined,
            }
        } catch (error) {
            throw new Error("Error al registrar el usuario");
        }

    }

    static async logout(authorization: string) {
        try {
            const token = authorization.split(' ')[1];

            const decoded: any = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                throw new Error("Token no válido");
            }

            const expiresAt = new Date(decoded.exp * 1000);

            await TokenBlacklistModel.addToBlacklist(token, expiresAt);

            return true;
        } catch (error) {
            console.error(error);
            throw new Error("Error al cerrar sesión");
        }
    }

    static async processForgotPassword(email: string) {
        const user = await AuthModel.getUserByEmail(email);

        if (user.length === 0) {
            throw new Error("El usuario no existe");
        }

        const { id, password: passwordUser } = user[0];

        const secret = process.env.JWT_SECRET as string + passwordUser;

        const timestamp = Date.now();

        const token = jwt.sign({ email, timestamp }, secret, { expiresIn: "15m", algorithm: "HS256" });

        const resetUrl = `${process.env.BASE_URL_FRONT}/new-password?id=${id}&token=${token}`;

        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM as string,
            to: email,
            subject: "Reset de contraseña",
            html: structureEmailHtml(resetUrl),
        });

        if (error) {
            throw new Error("Error al enviar el correo: " + error.message);
        }
    }

    static async processResetPassword(id: string, token: string, newPassword: string) {
        const user = await AuthModel.getUserById(id);

        if (user.length === 0) {
            throw new Error("El usuario no existe");
        }

        const secret = process.env.JWT_SECRET as string + user[0].password;

        try {
            jwt.verify(token, secret, { algorithms: ["HS256"] });
        } catch (error: any) {
            if (error.name === 'TokenExpiredError' || error.message === 'jwt expired') {
                throw new Error("El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.");
            } else if (error.name === 'JsonWebTokenError' || error.message === 'invalid signature') {
                throw new Error("El enlace de recuperación es inválido o la contraseña ya fue actualizada.");
            }
            throw new Error("Error de validación del enlace");
        }

        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));

        await AuthModel.updatePassword(id, hashedPassword);
    }

}

export default AuthService;