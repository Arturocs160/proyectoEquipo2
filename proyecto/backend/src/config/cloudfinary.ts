import { v2 as cloudinary } from "cloudinary";

import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(file: string | Buffer) {
    try {
        if (typeof file === "string") {
            const { secure_url } = await cloudinary.uploader.upload(file);
            return secure_url;
        }

        const secureUrl = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (error || !result) {
                    reject(error || new Error("No se obtuvo respuesta de Cloudinary"));
                    return;
                }
                resolve(result.secure_url);
            });

            uploadStream.end(file);
        });

        return secureUrl;
    } catch (error) {
        throw error;
    }
}

async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
}

export { uploadImage, deleteImage };