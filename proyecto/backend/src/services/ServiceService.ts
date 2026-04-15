import ServiceModel from "../models/ServiceModel";
import { uploadImage } from "../config/cloudfinary";
import fs from "fs";

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

        // Si Multer guardó exitosamente el archivo en el disco
        if (imageFile && imageFile.path) {
            // Subimos la imagen a Cloudinary desde la ruta local
            imageUrl = await uploadImage(imageFile.path);

            // Importante: Eliminar el archivo local temporal después de subirlo
            try {
                fs.unlinkSync(imageFile.path);
            } catch (error) {
                console.error("Error al eliminar el archivo temporal:", error);
            }
        }

        return await ServiceModel.create(businessId, name, description, durationMinutes, price, imageUrl);
    }

    static async update(id: string, businessId: string, name: string, description: string | null, durationMinutes: number, price: number | null, imageFileOrUrl?: any) {
        let imageUrl: string | null = null;

        // Si es un archivo nuevo desde Multer
        if (imageFileOrUrl && imageFileOrUrl.path) {
            imageUrl = await uploadImage(imageFileOrUrl.path);
            
            try {
                fs.unlinkSync(imageFileOrUrl.path);
            } catch (error) {
                console.error("Error al eliminar el archivo temporal:", error);
            }
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
