import ServiceModel from "../models/ServiceModel";
import { uploadImage } from "../config/cloudfinary";

class ServiceService {
    static async getByBusinessId(businessId: string) {
        return await ServiceModel.getByBusinessId(businessId);
    }

    static async getAll() {
        return await ServiceModel.getAll();
    }

    static async getById(id: string) {
        return await ServiceModel.getById(id);
    }

    static async create(businessId: string, name: string, description: string | null, durationMinutes: number, price: number | null, imageFile?: Express.Multer.File) {
        let imageUrl: string | null = null;

        if (imageFile?.buffer) {
            imageUrl = await uploadImage(imageFile.buffer);
        }

        return await ServiceModel.create(businessId, name, description, durationMinutes, price, imageUrl);
    }

    static async update(id: string, businessId: string, name: string, description: string | null, durationMinutes: number, price: number | null, imageFileOrUrl?: any) {
        let imageUrl: string | null = null;

        if (imageFileOrUrl?.buffer) {
            imageUrl = await uploadImage(imageFileOrUrl.buffer);
        } else if (typeof imageFileOrUrl === 'string') {
            // Si es un string, significa que mantuvieron la misma URL en Frontend
            imageUrl = imageFileOrUrl;
        }

        return await ServiceModel.update(id, businessId, name, description, durationMinutes, price, imageUrl);
    }

    static async delete(id: string) {
        return await ServiceModel.delete(id);
    }
}

export default ServiceService;
