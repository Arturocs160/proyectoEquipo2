import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
    static async getAll(req: Request, res: Response) {
        try {
            const users = await UserService.getAll();
            res.status(200).json({ data: users });
        } catch (error: any) {
            console.error("Error en UserController.getAll:", error);
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async updateRole(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { role } = req.body;
            const updated = await UserService.updateRole(id, role);
            res.status(200).json({ message: "Rol actualizado exitosamente", data: updated });
        } catch (error: any) {
            console.error("Error en UserController.updateRole:", error);
            res.status(500).json({ message: "Error al actualizar rol", error: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await UserService.deleteUser(id);
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } catch (error: any) {
            console.error("Error en UserController.deleteUser:", error);
            res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
        }
    }
}

export default UserController;
