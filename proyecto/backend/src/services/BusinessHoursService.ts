import BusinessHoursModel from "../models/BusinessHoursModel";

class BusinessHoursService {
    static async getByBusinessId(businessId: string) {
        return await BusinessHoursModel.getByBusinessId(businessId);
    }

    static async upsert(businessId: string, dayOfWeek: number, openTime: string | null, closeTime: string | null, isActive: boolean) {
        return await BusinessHoursModel.upsert(businessId, dayOfWeek, openTime, closeTime, isActive);
    }
}

export default BusinessHoursService;
