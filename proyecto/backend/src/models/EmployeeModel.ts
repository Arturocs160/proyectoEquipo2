import connection from "../config/db";

class EmployeeModel {
    static async getByBranchId(branchId: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM employees WHERE branch_id = $1', [branchId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const { rows } = await connection.query('SELECT * FROM employees');
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM employees WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(branchId: string, fullName: string, specialty: string | null, isActive: boolean = true, age: number, email: string) {
        try {
            const { rows } = await connection.query(
                'INSERT INTO employees (branch_id, full_name, specialty, is_active, age, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [branchId, fullName, specialty, isActive, age, email]
            );
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: string, branchId: string, fullName: string, specialty: string | null, isActive: boolean, age: number, email: string) {
        try {
            await connection.query(
                'UPDATE employees SET branch_id = $1, full_name = $2, specialty = $3, is_active = $4, age = $5, email = $6 WHERE id = $7',
                [branchId, fullName, specialty, isActive, age, email, id]
            );
            const { rows } = await connection.query('SELECT * FROM employees WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        // En lugar de borrar, comúnmente se desactiva
        try {
            const result = await connection.query('DELETE FROM employees WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default EmployeeModel;
