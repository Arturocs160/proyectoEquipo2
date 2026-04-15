import DisabledDatesModel from "../models/DisabledDatesModel";

class DisabledDatesService {
    static async getByBusinessId(businessId: string) {
        return await DisabledDatesModel.getByBusinessId(businessId);
    }

    static async create(businessId: string, closedDate: string, reason: string) {
        const result = await DisabledDatesModel.create(businessId, closedDate, reason);
        return result[0] || null;
    }

    static async delete(id: string) {
        return await DisabledDatesModel.delete(id);
    }
}

export default DisabledDatesService;
