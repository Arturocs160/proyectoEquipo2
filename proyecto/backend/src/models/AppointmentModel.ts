import connection from "@config/db";

class AppointmentModel {
    static async searchByBooker(email: string, folio?: string) {
        try {
            let query = `
                SELECT
                    a.id,
                    a.scheduled_at,
                    a.status,
                    s.name AS service_name,
                    bi.name AS business_name,
                    b.name AS branch_name,
                    b.address AS branch_address
                FROM appointments a
                JOIN services s ON a.service_id = s.id
                JOIN branches b ON a.branch_id = b.id
                JOIN business_info bi ON b.business_id = bi.id
                WHERE LOWER(a.booker_email) = LOWER($1)
            `;
            const params: any[] = [email];

            if (folio) {
                query += ' AND a.id = $2';
                params.push(folio);
            }

            query += ' ORDER BY a.scheduled_at DESC';

            const { rows } = await connection.query(query, params);
            return rows as any[];
        } catch (error) {
            throw error;
        }
    }

    static async getAvailability(businessId: string, serviceId: string, date: string, branchId?: string, employeeId?: string) {
        try {
            let selectedBranchId = branchId;

            if (!selectedBranchId) {
                const { rows: branchRows } = await connection.query(
                    'SELECT id FROM branches WHERE business_id = $1 ORDER BY id ASC LIMIT 1',
                    [businessId]
                );
                const branch = (branchRows as any[])[0];
                selectedBranchId = branch ? String(branch.id) : undefined;
            } else {
                const { rows: branchRows } = await connection.query(
                    'SELECT id FROM branches WHERE id = $1 AND business_id = $2 LIMIT 1',
                    [selectedBranchId, businessId]
                );
                if ((branchRows as any[]).length === 0) {
                    return { branchId: null, slots: [] };
                }
            }

            if (!selectedBranchId) {
                return { branchId: null, slots: [] };
            }

            const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

            const { rows: disabledRows } = await connection.query(
                'SELECT id FROM disabled_dates WHERE business_id = $1 AND closed_date = $2 LIMIT 1',
                [businessId, date]
            );
            if ((disabledRows as any[]).length > 0) {
                return { branchId: selectedBranchId, slots: [] };
            }

            const { rows: hoursRows } = await connection.query(
                `SELECT open_time, close_time, is_active
                 FROM business_hours
                 WHERE business_id = $1 AND day_of_week = $2
                 LIMIT 1`,
                [businessId, dayOfWeek]
            );
            const hours = (hoursRows as any[])[0];

            if (!hours || !hours.is_active || !hours.open_time || !hours.close_time) {
                return { branchId: selectedBranchId, slots: [] };
            }

            const { rows: serviceRows } = await connection.query(
                'SELECT duration_minutes FROM services WHERE id = $1 AND business_id = $2 LIMIT 1',
                [serviceId, businessId]
            );
            const service = (serviceRows as any[])[0];

            if (!service || !service.duration_minutes) {
                return { branchId: selectedBranchId, slots: [] };
            }

            const durationMinutes = Number(service.duration_minutes);

                        let busyQuery =
                                `SELECT
                                        TO_CHAR(a.scheduled_at, 'HH24:MI') as start_time,
                                        s.duration_minutes as duration_minutes
                                 FROM appointments a
                                 JOIN services s ON a.service_id = s.id
                                 WHERE a.branch_id = $1
                                     AND a.scheduled_at::date = $2::date
                                     AND a.status IN ('pending', 'confirmed', 'completed')`;
                        const busyParams: any[] = [selectedBranchId, date];

            if (employeeId) {
                busyQuery += ' AND a.employee_id = $3';
                busyParams.push(employeeId);
            }

            const { rows: busyRows } = await connection.query(busyQuery, busyParams);

            const toMinutes = (time: string) => {
                const [hh, mm] = time.split(":").map(Number);
                return hh * 60 + mm;
            };

            const fromMinutes = (value: number) => {
                const hh = String(Math.floor(value / 60)).padStart(2, "0");
                const mm = String(value % 60).padStart(2, "0");
                return `${hh}:${mm}`;
            };

            const open = toMinutes(String(hours.open_time).slice(0, 5));
            const close = toMinutes(String(hours.close_time).slice(0, 5));

            const busyIntervals = (busyRows as any[]).map((row) => {
                const start = toMinutes(String(row.start_time));
                const busyDuration = Number(row.duration_minutes) || 0;
                return { start, end: start + busyDuration };
            });

            const slots: string[] = [];
            for (let minute = open; minute + durationMinutes <= close; minute += durationMinutes) {
                const slot = fromMinutes(minute);
                const slotStart = minute;
                const slotEnd = minute + durationMinutes;

                const hasOverlap = busyIntervals.some((busy) => slotStart < busy.end && slotEnd > busy.start);
                if (!hasOverlap) {
                    slots.push(slot);
                }
            }

            return { branchId: selectedBranchId, slots };
        } catch (error) {
            throw error;
        }
    }

    static async getAllWithDetails(branchId?: string, businessId?: string) {
        try {
            let query = `
                SELECT 
                    a.id, 
                    s.name as servicio, 
                    a.booker_name,
                    a.booker_email,
                    e.full_name as empleado,
                    TO_CHAR(a.scheduled_at, 'HH12:MI AM') as hora, 
                    a.status,
                    a.scheduled_at as raw_date
                FROM appointments a
                JOIN services s ON a.service_id = s.id
                LEFT JOIN employees e ON a.employee_id = e.id
                JOIN branches b ON a.branch_id = b.id
            `;
            const params: any[] = [];

            if (branchId) {
                query += ' WHERE a.branch_id = $1';
                params.push(branchId);
            } else if (businessId) {
                query += ' WHERE b.business_id = $1';
                params.push(businessId);
            }

            query += ' ORDER BY a.scheduled_at DESC';

            const { rows } = await connection.query(query, params);
            const data = (rows as any[]).map(row => {
                let formattedStatus = "Pendiente";
                if (row.status === 'confirmed') formattedStatus = "Confirmado";
                else if (row.status === 'cancelled') formattedStatus = "Cancelado";
                else if (row.status === 'completed') formattedStatus = "Completado";

                return {
                    id: row.id,
                    servicio: row.servicio,
                    bookerName: row.booker_name || null,
                    bookerEmail: row.booker_email || null,
                    empleado: row.empleado || null,
                    hora: row.hora,
                    status: formattedStatus,
                    raw_date: row.raw_date
                }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id: string) {
        try {
            const { rows } = await connection.query('SELECT * FROM appointments WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async create(
        branchId: string,
        serviceId: string,
        scheduledAt: string,
        bookerName: string,
        bookerEmail: string,
        bookerPhone: string,
        employeeId?: string | null,
        notes?: string | null
    ) {
        try {
            const result = await connection.query(
                `INSERT INTO appointments 
                    (branch_id, employee_id, service_id, scheduled_at, status, booker_name, booker_email, booker_phone, notes) 
                 VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8)`,
                [branchId, employeeId || null, serviceId, scheduledAt, bookerName, bookerEmail, bookerPhone, notes || null]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(id: string, status: string) {
        try {
            await connection.query('UPDATE appointments SET status = $1 WHERE id = $2', [status, id]);
            const { rows } = await connection.query('SELECT * FROM appointments WHERE id = $1', [id]);
            return rows as any;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: string) {
        try {
            const result = await connection.query('DELETE FROM appointments WHERE id = $1', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default AppointmentModel;
