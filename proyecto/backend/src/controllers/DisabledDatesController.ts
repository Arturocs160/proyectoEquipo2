import { Request, Response } from "express";
import DisabledDatesService from "../services/DisabledDatesService";

class DisabledDatesController {
    static async getByBusinessId(req: Request, res: Response) {
        try {
            const businessId = req.params.businessId as string;
            const dates = await DisabledDatesService.getByBusinessId(businessId);
            res.status(200).json({ data: dates });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { businessId, closedDate, reason } = req.body;
            const result = await DisabledDatesService.create(businessId, closedDate, reason);
            res.status(201).json({ message: "Fecha bloqueada registrada", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await DisabledDatesService.delete(id);
            res.status(200).json({ message: "Fecha bloqueada eliminada" });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

export default DisabledDatesController;
