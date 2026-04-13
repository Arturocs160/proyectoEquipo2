import DisabledDatesModel from "@models/DisabledDatesModel";

class DisabledDatesService {
    static async getByBusinessId(businessId: string) {
        return await DisabledDatesModel.getByBusinessId(businessId);
    }

    static async create(businessId: string, closedDate: string, reason: string) {
        return await DisabledDatesModel.create(businessId, closedDate, reason);
    }

    static async delete(id: string) {
        return await DisabledDatesModel.delete(id);
    }
}

export default DisabledDatesService;
