import { Request, Response } from "express";
import BusinessHoursService from "../services/BusinessHoursService";

class BusinessHoursController {
    static async getByBusinessId(req: Request, res: Response) {
        try {
            const businessId = req.params.businessId as string;
            const hours = await BusinessHoursService.getByBusinessId(businessId);
            res.status(200).json({ data: hours });
        } catch (error: any) {
            console.error("Error en BusinessHoursController.getByBusinessId:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async upsert(req: Request, res: Response) {
        try {
            const { businessId, dayOfWeek, openTime, closeTime, isActive } = req.body;
            // isActive se espera boolean, dayOfWeek number
            await BusinessHoursService.upsert(businessId, Number(dayOfWeek), openTime, closeTime, Boolean(isActive));
            res.status(200).json({ message: "Horarios guardados exitosamente" });
        } catch (error: any) {
            console.error("Error en BusinessHoursController.upsert:", error);
            res.status(500).json({ message: "Error interno al guardar horarios", error: error.message });
        }
    }
}

export default BusinessHoursController;
