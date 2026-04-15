import connection from "@config/db"

class AuthModel {
    static async getUserByEmail(email: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id: string) {
        try {
            const { rows } = await connection.query('SELECT u.id as userId, u.full_name, u.email, u.role, u.password, b.id as businessId FROM users u JOIN business_info b ON u.id = b.owner_id WHERE u.id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async createAccount(id: string, full_name: string, email: string, phone: string, password: string) {
        const client = await connection.connect();
        try {
            const slugBase = full_name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            const slug = `${slugBase}-${id.slice(0, 8)}`;

            await client.query("BEGIN");

            await client.query(
                `INSERT INTO users (id, full_name, email, phone, password, role)
                 VALUES ($1, $2, $3, $4, $5, 'owner')`,
                [id, full_name, email, phone, password]
            );

            const { rows: businessRows } = await client.query(
                `INSERT INTO business_info (owner_id, slug, name, description)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [id, slug, `Negocio de ${full_name}`, "Bienvenido."]
            );

            const businessId = businessRows[0]?.id;

            await client.query(
                `INSERT INTO branches (business_id, name, address, phone)
                 VALUES ($1, $2, $3, $4)`,
                [businessId, "Sucursal Principal", "Dirección por definir", phone]
            );

            await client.query("COMMIT");

            const { rows } = await connection.query('SELECT * FROM users WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            await client.query("ROLLBACK");
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async updatePassword(id: string, password: string) {
        try {
            await connection.query('UPDATE users SET password = $1 WHERE id = $2', [password, id]);
            const { rows } = await connection.query('SELECT * FROM users WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

}

export default AuthModel;