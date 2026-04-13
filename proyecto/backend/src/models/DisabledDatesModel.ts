import connection from "@config/db";

class DisabledDatesModel {
    static async getByBusinessId(businessId: string) {
        try {
            const [rows] = await connection.query('SELECT id, DATE_FORMAT(closed_date, "%Y-%m-%d") as date, reason FROM disabled_dates WHERE business_id = ? ORDER BY closed_date ASC', [businessId]);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async create(businessId: string, closedDate: string, reason: string) {
        try {
            const [result] = await connection.query(
                'INSERT INTO disabled_dates (business_id, closed_date, reason) VALUES (?, ?, ?)',
                [businessId, closedDate, reason || null]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const [result] = await connection.query('DELETE FROM disabled_dates WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default DisabledDatesModel;
