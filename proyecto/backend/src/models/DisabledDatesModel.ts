import connection from "../config/db";

class DisabledDatesModel {
    static async getByBusinessId(businessId: string) {
        try {
            const { rows } = await connection.query("SELECT id, TO_CHAR(closed_date, 'YYYY-MM-DD') as date, reason FROM disabled_dates WHERE business_id = $1 ORDER BY closed_date ASC", [businessId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async create(businessId: string, closedDate: string, reason: string) {
        try {
            const { rows } = await connection.query(
                'INSERT INTO disabled_dates (business_id, closed_date, reason) VALUES ($1, $2, $3) RETURNING *',
                [businessId, closedDate, reason || null]
            );
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const result = await connection.query('DELETE FROM disabled_dates WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default DisabledDatesModel;
