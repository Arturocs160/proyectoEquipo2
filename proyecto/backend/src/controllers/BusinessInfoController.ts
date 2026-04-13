import { Request, Response } from "express";
import BusinessInfoService from "@services/BusinessInfoService";

interface AuthenticatedRequest extends Request {
    user?: {
        id?: string;
    };
}

class BusinessInfoController {
    static async getInfo(req: Request, res: Response) {
        try {
            const ownerId = req.params.businessId as string;
            const info = await BusinessInfoService.getInfo(ownerId);
            res.status(200).json({ data: info });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getBySlug(req: Request, res: Response) {
        try {
            const slug = req.params.slug as string;
            const info = await BusinessInfoService.getBySlug(slug);
            res.status(200).json({ data: info });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const ownerId = authReq.user?.id;
            const businessId = req.params.businessId as string;

            if (!ownerId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }

            const { name, specialty, description, location, rating, logo_url } = req.body;

            const fileOrUrl = req.file || logo_url;

            const updated = await BusinessInfoService.updateByBusinessId(ownerId, businessId, name, specialty, description, location, rating, fileOrUrl);

            if (!updated || updated.length === 0) {
                res.status(404).json({ message: "Negocio no encontrado para este usuario" });
                return;
            }

            res.status(200).json({ message: "Información de negocio actualizada", data: updated });
        } catch (error: any) {
            console.error("Error en BusinessInfoController.update:", error);
            res.status(500).json({ message: "Error interno al actualizar", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const authReq = req as AuthenticatedRequest;
            const ownerId = authReq.user?.id;

            if (!ownerId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }

            const { name, specialty, description, location, rating, logo_url } = req.body;
            const fileOrUrl = req.file || logo_url;

            const created = await BusinessInfoService.create(ownerId, name, specialty, description, location, rating, fileOrUrl);
            res.status(201).json({ message: "Negocio creado", data: created });
        } catch (error: any) {
            console.error("Error en BusinessInfoController.create:", error);
            res.status(500).json({ message: "Error interno al crear negocio", error: error.message });
        }
    }
}

export default BusinessInfoController;
