import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenBlacklistModel from "../models/TokenBlacklistModel";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const checkAuth = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(" ")[1];
    console.log("checkAuth - received token:", token?.substring(0, 20) + "...");

    if (!token) {
        console.log("checkAuth - no token found");
        return response.status(401).json({ message: "No hay token" });
    }

    const isExpired = await TokenBlacklistModel.isTokenBlacklisted(token)

    if (isExpired) {
        console.log("checkAuth - token is blacklisted");
        return response.status(401).json({ message: "Token no válido (expirado)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        request.user = decoded;
        console.log("checkAuth - token verified successfully, user:", decoded);
        next();
    } catch (error) {
        console.log("checkAuth - token verification failed:", error);
        return response.status(401).json({ message: 'Token no válido' });
    }

}