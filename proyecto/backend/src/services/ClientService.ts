import ClientModel from "@models/ClientModel";

class ClientService {
    static async getAll() {
        return await ClientModel.getAll();
    }

    static async getById(id: string) {
        return await ClientModel.getById(id);
    }

    static async create(fullName: string, email: string | null, phone: string) {
        return await ClientModel.create(fullName, email, phone);
    }

    static async update(id: string, fullName: string, email: string | null, phone: string) {
        return await ClientModel.update(id, fullName, email, phone);
    }

    static async delete(id: string) {
        return await ClientModel.delete(id);
    }
}

export default ClientService;
