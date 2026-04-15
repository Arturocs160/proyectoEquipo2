import connection from "@config/db";

class BusinessInfoModel {
    static async getInfo(ownerId: string) {
        try {
            const { rows } = await connection.query(
                'SELECT id, owner_id, slug, logo_url, name, specialty, description, location, rating FROM business_info WHERE owner_id = $1 ORDER BY id ASC',
                [ownerId]
            );
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async getBySlug(slug: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM business_info WHERE slug = $1', [slug]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async slugExists(slug: string) {
        try {
            const { rows } = await connection.query('SELECT id FROM business_info WHERE slug = $1 LIMIT 1', [slug]);
            return (rows as any[]).length > 0;
        } catch (error) {
            throw error;
        }
    }

    static async create(ownerId: string, slug: string, name: string, specialty?: string, description?: string, location?: string, rating?: string, logo_url?: string) {
        try {
            const { rows: insertedRows } = await connection.query(
                `INSERT INTO business_info (owner_id, slug, logo_url, name, specialty, description, location, rating)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 RETURNING id`,
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

            const insertedId = insertedRows[0]?.id;
            const { rows } = await connection.query('SELECT * FROM business_info WHERE id = $1 AND owner_id = $2', [insertedId, ownerId]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async updateByBusinessId(ownerId: string, businessId: string, name: string, specialty?: string, description?: string, location?: string, rating?: string, logo_url?: string) {
        try {
            const result = await connection.query(
                `UPDATE business_info
                 SET name = $1,
                     specialty = $2,
                     description = $3,
                     location = $4,
                     rating = $5,
                     logo_url = $6
                 WHERE id = $7 AND owner_id = $8`,
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

            if (result.rowCount === 0) {
                return [];
            }

            if (location && location.trim().length > 0) {
                await connection.query(
                    `UPDATE branches
                     SET address = $1
                     WHERE id = (
                        SELECT id
                        FROM branches
                        WHERE business_id = $2
                        ORDER BY id ASC
                        LIMIT 1
                     )`,
                    [location, businessId]
                );
            }

            const { rows } = await connection.query('SELECT * FROM business_info WHERE id = $1 AND owner_id = $2', [businessId, ownerId]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }
}

export default BusinessInfoModel;
