import { Request, Response } from "express";
import EmployeeService from "../services/EmployeeService";

class EmployeeController {
    static async getAll(req: Request, res: Response) {
        try {
            const employees = await EmployeeService.getAll();
            res.status(200).json({ data: employees });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getByBranchId(req: Request, res: Response) {
        try {
            const branchId = req.params.branchId as string;
            const employees = await EmployeeService.getByBranchId(branchId);
            res.status(200).json({ data: employees });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const employee = await EmployeeService.getById(id);
            res.status(200).json({ data: employee });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { branchId, fullName, specialty, isActive, age, email } = req.body;
            const result = await EmployeeService.create(branchId, fullName, specialty, Boolean(isActive), age, email);
            res.status(201).json({ message: "Empleado creado", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { branchId, fullName, specialty, isActive, age, email } = req.body;
            const result = await EmployeeService.update(id, branchId, fullName, specialty, Boolean(isActive), age, email);
            res.status(200).json({ message: "Empleado actualizado", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await EmployeeService.delete(id);
            res.status(200).json({ message: "Empleado eliminado" });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}

export default EmployeeController;
