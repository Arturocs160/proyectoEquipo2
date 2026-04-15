import AppointmentModel from "../models/AppointmentModel";

class AppointmentService {
    static async searchByBooker(email: string, folio?: string) {
        if (!email) {
            throw new Error("email es obligatorio");
        }

        return await AppointmentModel.searchByBooker(email, folio);
    }

    static async getAvailability(businessId: string, serviceId: string, date: string, branchId?: string, employeeId?: string) {
        if (!businessId || !serviceId || !date) {
            throw new Error("businessId, serviceId y date son obligatorios");
        }

        return await AppointmentModel.getAvailability(businessId, serviceId, date, branchId, employeeId);
    }

    static async getAllWithDetails(branchId?: string, businessId?: string) {
        return await AppointmentModel.getAllWithDetails(branchId, businessId);
    }

    static async getById(id: string) {
        return await AppointmentModel.getById(id);
    }

    static async create(
        branchId: string,
        serviceId: string,
        scheduledAt: string,
        bookerName: string,
        bookerEmail: string,
        bookerPhone: string,
        employeeId?: string | null,
        notes?: string | null
    ) {
        if (!branchId || !serviceId || !scheduledAt || !bookerName || !bookerEmail || !bookerPhone) {
            throw new Error("Faltan datos obligatorios para crear la cita");
        }
        const result = await AppointmentModel.create(branchId, serviceId, scheduledAt, bookerName, bookerEmail, bookerPhone, employeeId, notes);
        return result[0] || null;
    }

    static async updateStatus(id: string, status: string) {
        const result = await AppointmentModel.updateStatus(id, status);
        return result[0] || null;
    }

    static async delete(id: string) {
        return await AppointmentModel.delete(id);
    }
}

export default AppointmentService;
