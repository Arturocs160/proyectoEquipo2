import { v2 as cloudinary } from "cloudinary";

import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(filePath: string) {
    try {
        const { secure_url } = await cloudinary.uploader.upload(filePath);
        return secure_url;
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