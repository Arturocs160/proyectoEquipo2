import BranchModel from "../models/BranchModel";

class BranchService {
    static async getAll(businessId: string) {
        if (!businessId) {
            throw new Error("Se requiere el ID del negocio");
        }
        return await BranchModel.getAll(businessId);
    }

    static async getById(id: string) {
        return await BranchModel.getById(id);
    }

    static async create(businessId: string, name: string, address: string, phone: string) {
        return await BranchModel.create(businessId, name, address, phone);
    }

    static async update(id: string, name: string, address: string, phone: string) {
        return await BranchModel.update(id, name, address, phone);
    }

    static async delete(id: string) {
        return await BranchModel.delete(id);
    }
}

export default BranchService;
