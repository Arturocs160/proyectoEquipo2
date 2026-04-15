import UserModel from "../models/UserModel";

class UserService {
    static async getAll() {
        return await UserModel.getAll();
    }

    static async updateRole(id: string, role: string) {
        if (!id || !role) {
            throw new Error("El ID del usuario y el rol son requeridos");
        }
        const result = await UserModel.updateRole(id, role);
        return result[0] || null;
    }

    static async deleteUser(id: string) {
        if (!id) {
            throw new Error("El ID del usuario es requerido");
        }
        return await UserModel.delete(id);
    }
}

export default UserService;
