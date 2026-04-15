import ClientModel from "../models/ClientModel";

class ClientService {
    static async getAll() {
        return await ClientModel.getAll();
    }

    static async getById(id: string) {
        return await ClientModel.getById(id);
    }

    static async create(fullName: string, email: string | null, phone: string) {
        const result = await ClientModel.create(fullName, email, phone);
        return result[0] || null;
    }

    static async update(id: string, fullName: string, email: string | null, phone: string) {
        const result = await ClientModel.update(id, fullName, email, phone);
        return result[0] || null;
    }

    static async delete(id: string) {
        return await ClientModel.delete(id);
    }
}

export default ClientService;
