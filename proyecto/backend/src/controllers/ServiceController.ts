import { Request, Response } from "express";
import ServiceService from "../services/ServiceService";

class ServiceController {
    static async getAll(req: Request, res: Response) {
        try {
            const services = await ServiceService.getAll();
            res.status(200).json({ data: services });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getByBusinessId(req: Request, res: Response) {
        try {
            const businessId = req.params.businessId as string;
            const services = await ServiceService.getByBusinessId(businessId);
            res.status(200).json({ data: services });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const service = await ServiceService.getById(id);
            res.status(200).json({ data: service });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { businessId, name, description, durationMinutes, price, imageUrl } = req.body;
            const fileOrUrl = req.file || imageUrl; // Si viene por multipart o si la adjuntan directo

            const result = await ServiceService.create(
                businessId,
                name,
                description,
                Number(durationMinutes),
                Number(price),
                fileOrUrl
            );

            res.status(201).json({ message: "Servicio creado", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { businessId, name, description, durationMinutes, price, imageUrl } = req.body;
            const fileOrUrl = req.file || imageUrl; // Si Multer intercepta `image`, o si pasan el `imageUrl` como text

            const result = await ServiceService.update(
                id,
                businessId,
                name,
                description,
                Number(durationMinutes),
                Number(price),
                fileOrUrl
            );

            res.status(200).json({ message: "Servicio actualizado", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await ServiceService.delete(id);
            res.status(200).json({ message: "Servicio eliminado" });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

export default ServiceController;
