import connection from "@config/db"

class AuthModel {
    static async getUserByEmail(email: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async createAccount(id: string, full_name: string, email: string, password: string, role: string, phone: string) {
        try {
            await connection.query('INSERT INTO users (id, full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)', [id, full_name, email, password, role, phone]);
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async updatePassword(id: string, password: string) {
        try {
            await connection.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

}

export default AuthModel;