import { Request, Response } from "express";
import BranchService from "../services/BranchService";

class BranchController {
    static async getAll(req: Request, res: Response) {
        try {
            const businessId = req.params.businessId as string;
            const branches = await BranchService.getAll(businessId);
            res.status(200).json({ data: branches });
        } catch (error: any) {
            console.error("Error en BranchController.getAll:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const branch = await BranchService.getById(id);
            res.status(200).json({ data: branch });
        } catch (error: any) {
            console.error("Error en BranchController.getById:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { businessId, name, address, phone } = req.body;
            const result = await BranchService.create(businessId, name, address, phone);
            res.status(201).json({ message: "Sucursal creada", data: result });
        } catch (error: any) {
            console.error("Error en BranchController.create:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { name, address, phone } = req.body;
            const result = await BranchService.update(id, name, address, phone);
            res.status(200).json({ message: "Sucursal actualizada", data: result });
        } catch (error: any) {
            console.error("Error en BranchController.update:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await BranchService.delete(id);
            res.status(200).json({ message: "Sucursal eliminada" });
        } catch (error: any) {
            console.error("Error en BranchController.delete:", error);
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

export default BranchController;
