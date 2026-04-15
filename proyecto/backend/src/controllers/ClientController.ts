import { Request, Response } from "express";
import ClientService from "../services/ClientService";

class ClientController {
    static async getAll(req: Request, res: Response) {
        try {
            const clients = await ClientService.getAll();
            res.status(200).json({ data: clients });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const client = await ClientService.getById(id);
            res.status(200).json({ data: client });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { fullName, email, phone } = req.body;
            const result = await ClientService.create(fullName, email, phone);
            res.status(201).json({ message: "Cliente creado exitosamente", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { fullName, email, phone } = req.body;
            const updated = await ClientService.update(id, fullName, email, phone);
            res.status(200).json({ message: "Cliente actualizado", data: updated });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await ClientService.delete(id);
            res.status(200).json({ message: "Cliente eliminado" });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

export default ClientController;
