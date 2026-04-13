import connection from "@config/db";

class BusinessInfoModel {
    static async getInfo(ownerId: string) {
        try {
            const [rows] = await connection.query(
                'SELECT id, owner_id, slug, logo_url, name, specialty, description, location, rating FROM business_info WHERE owner_id = ? ORDER BY id ASC',
                [ownerId]
            );
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async getBySlug(slug: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM business_info WHERE slug = ?', [slug]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async slugExists(slug: string) {
        try {
            const [rows] = await connection.query('SELECT id FROM business_info WHERE slug = ? LIMIT 1', [slug]);
            return (rows as any[]).length > 0;
        } catch (error) {
            throw error;
        }
    }

    static async create(ownerId: string, slug: string, name: string, specialty?: string, description?: string, location?: string, rating?: string, logo_url?: string) {
        try {
            const [result]: any = await connection.query(
                `INSERT INTO business_info (owner_id, slug, logo_url, name, specialty, description, location, rating)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ownerId,
                    slug,
                    logo_url || null,
                    name,
                    specialty || null,
                    description || null,
                    location || null,
                    rating || null
                ]
            );

            const [rows] = await connection.query('SELECT * FROM business_info WHERE id = ? AND owner_id = ?', [result.insertId, ownerId]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async updateByBusinessId(ownerId: string, businessId: string, name: string, specialty?: string, description?: string, location?: string, rating?: string, logo_url?: string) {
        try {
            const [result]: any = await connection.query(
                `UPDATE business_info
                 SET name = ?,
                     specialty = ?,
                     description = ?,
                     location = ?,
                     rating = ?,
                     logo_url = ?
                 WHERE id = ? AND owner_id = ?`,
                [
                    name,
                    specialty || null,
                    description || null,
                    location || null,
                    rating || null,
                    logo_url || null,
                    businessId,
                    ownerId
                ]
            );

            if (!result.affectedRows) {
                return [];
            }

            if (location && location.trim().length > 0) {
                await connection.query(
                    `UPDATE branches
                     SET address = ?
                     WHERE business_id = ?
                     ORDER BY id ASC
                     LIMIT 1`,
                    [location, businessId]
                );
            }

            const [rows] = await connection.query('SELECT * FROM business_info WHERE id = ? AND owner_id = ?', [businessId, ownerId]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }
}

export default BusinessInfoModel;
