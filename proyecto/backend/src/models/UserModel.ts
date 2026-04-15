import connection from "@config/db";

class UserModel {
    static async getAll() {
        try {
            const { rows } = await connection.query('SELECT id, full_name, email, phone, role, last_login, created_at FROM users');
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async updateRole(id: string, role: string) {
        try {
            await connection.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
            const { rows } = await connection.query('SELECT id, full_name, email, phone, role FROM users WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const result = await connection.query('DELETE FROM users WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default UserModel;
