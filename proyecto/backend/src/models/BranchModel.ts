import connection from "@config/db";

class BranchModel {
    static async getAll(businessId: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM branches WHERE business_id = ?', [businessId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM branches WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(businessId: string, name: string, address: string, phone: string) {
        try {
            const [result] = await connection.query(
                'INSERT INTO branches (business_id, name, address, phone) VALUES (?, ?, ?, ?)',
                [businessId, name, address, phone]
            );
            return result as any;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, name: string, address: string, phone: string) {
        try {
            await connection.query('UPDATE branches SET name = ?, address = ?, phone = ? WHERE id = ?', [name, address, phone, id]);
            const [rows] = await connection.query('SELECT * FROM branches WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const [result] = await connection.query('DELETE FROM branches WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default BranchModel;
