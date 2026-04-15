import connection from "@config/db";

class BranchModel {
    static async getAll(businessId: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM branches WHERE business_id = $1', [businessId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM branches WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(businessId: string, name: string, address: string, phone: string) {
        try {
            const result = await connection.query(
                'INSERT INTO branches (business_id, name, address, phone) VALUES ($1, $2, $3, $4)',
                [businessId, name, address, phone]
            );
            return result as any;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, name: string, address: string, phone: string) {
        try {
            await connection.query('UPDATE branches SET name = $1, address = $2, phone = $3 WHERE id = $4', [name, address, phone, id]);
            const { rows } = await connection.query('SELECT * FROM branches WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const result = await connection.query('DELETE FROM branches WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default BranchModel;
