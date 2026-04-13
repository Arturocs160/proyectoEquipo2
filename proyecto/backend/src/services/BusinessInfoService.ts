import BusinessInfoModel from "@models/BusinessInfoModel";
import { uploadImage } from "@config/cloudfinary";
import fs from "fs";

class BusinessInfoService {
    static async getInfo(ownerId: string) {
        return await BusinessInfoModel.getInfo(ownerId);
    }

    static async getBySlug(slug: string) {
        return await BusinessInfoModel.getBySlug(slug);
    }

    private static normalizeSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || "negocio";
    }

    private static async ensureUniqueSlug(base: string) {
        let candidate = base;
        let attempt = 1;

        while (await BusinessInfoModel.slugExists(candidate)) {
            attempt += 1;
            candidate = `${base}-${attempt}`;
        }

        return candidate;
    }

    private static async resolveLogoUrl(logoFileOrUrl?: any) {
        let logoUrl: string | undefined = undefined;

        if (logoFileOrUrl && logoFileOrUrl.path) {
            logoUrl = await uploadImage(logoFileOrUrl.path);

            try {
                fs.unlinkSync(logoFileOrUrl.path);
            } catch (err) {
                console.error("No se pudo eliminar el logo local", err);
            }
        } else if (typeof logoFileOrUrl === 'string') {
            logoUrl = logoFileOrUrl;
        }

        return logoUrl;
    }

    static async create(ownerId: string, name: string, specialty: string, description: string, location: string, rating?: string, logoFileOrUrl?: any) {
        const slugBase = this.normalizeSlug(name);
        const slug = await this.ensureUniqueSlug(slugBase);
        const logoUrl = await this.resolveLogoUrl(logoFileOrUrl);

        return await BusinessInfoModel.create(ownerId, slug, name, specialty, description, location, rating, logoUrl);
    }

    static async updateByBusinessId(ownerId: string, businessId: string, name: string, specialty: string, description: string, location: string, rating?: string, logoFileOrUrl?: any) {
        const logoUrl = await this.resolveLogoUrl(logoFileOrUrl);

        return await BusinessInfoModel.updateByBusinessId(ownerId, businessId, name, specialty, description, location, rating, logoUrl);
    }
}

export default BusinessInfoService;
