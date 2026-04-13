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
            const [rows] = await connection.query('SELECT u.id as userId, u.full_name, u.email, u.role, b.id as businessId FROM users u JOIN business_info b ON u.id = b.owner_id WHERE u.id = ?', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async createAccount(id: string, full_name: string, email: string, phone: string, password: string) {
        try {
            await connection.execute("CALL sp_register_owner(?, ?, ?, ?, ?)", [id, full_name, email, phone, password]);
            const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows as any;
        } catch (error) {
            console.log(error);
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