import connection from "@config/db";

class ServiceModel {
    static async getByBusinessId(businessId: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM services WHERE business_id = $1', [businessId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const { rows } = await connection.query('SELECT * FROM services');
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM services WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(businessId: string, name: string, description: string | null, durationMinutes: number, price: number | null, imageUrl: string | null) {
        try {
            const result = await connection.query(
                'INSERT INTO services (business_id, name, description, duration_minutes, price, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                [businessId, name, description, durationMinutes, price, imageUrl]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, businessId: string, name: string, description: string | null, durationMinutes: number, price: number | null, imageUrl: string | null) {
        try {
            await connection.query(
                'UPDATE services SET business_id = $1, name = $2, description = $3, duration_minutes = $4, price = $5, image_url = $6 WHERE id = $7',
                [businessId, name, description, durationMinutes, price, imageUrl, id]
            );
            const { rows } = await connection.query('SELECT * FROM services WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const result = await connection.query('DELETE FROM services WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default ServiceModel;
