import connection from "@config/db";

class ClientModel {
    static async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM clients');
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM clients WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(fullName: string, email: string | null, phone: string) {
        try {
            const [result] = await connection.query(
                'INSERT INTO clients (full_name, email, phone) VALUES (?, ?, ?)',
                [fullName, email, phone]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, fullName: string, email: string | null, phone: string) {
        try {
            await connection.query(
                'UPDATE clients SET full_name = ?, email = ?, phone = ? WHERE id = ?',
                [fullName, email, phone, id]
            );
            const [rows] = await connection.query('SELECT * FROM clients WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const [result] = await connection.query('DELETE FROM clients WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default ClientModel;
