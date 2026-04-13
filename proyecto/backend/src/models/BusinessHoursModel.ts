import connection from "@config/db";

class BusinessHoursModel {
    static async getByBusinessId(businessId: string) {
        try {
            const [rows] = await connection.query('SELECT * FROM business_hours WHERE business_id = ? ORDER BY day_of_week ASC', [businessId]);
            
            // Mapear al formato esperado por el frontend
            const daysMap = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const data = (rows as any[]).map(row => {
                // Formatear las horas para quitar los segundos si es necesario (ej: 09:00:00 -> 09:00)
                const openTime = row.open_time ? row.open_time.slice(0, 5) : "";
                const closeTime = row.close_time ? row.close_time.slice(0, 5) : "";
                
                return {
                    id: row.id,
                    day_of_week: row.day_of_week, // Mantenemos el real
                    name: daysMap[row.day_of_week],
                    isActive: Boolean(row.is_active),
                    open: openTime,
                    close: closeTime
                };
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async upsert(businessId: string, dayOfWeek: number, openTime: string | null, closeTime: string | null, isActive: boolean) {
        try {
            // Revisar si ya existe
            const [existing] = await connection.query('SELECT id FROM business_hours WHERE business_id = ? AND day_of_week = ?', [businessId, dayOfWeek]) as any[];
            
            if (existing && existing.length > 0) {
                await connection.query(
                    'UPDATE business_hours SET open_time = ?, close_time = ?, is_active = ? WHERE business_id = ? AND day_of_week = ?',
                    [openTime, closeTime, isActive ? 1 : 0, businessId, dayOfWeek]
                );
            } else {
                await connection.query(
                    'INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_active) VALUES (?, ?, ?, ?, ?)',
                    [businessId, dayOfWeek, openTime, closeTime, isActive ? 1 : 0]
                );
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default BusinessHoursModel;
