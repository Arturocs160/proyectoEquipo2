import { z } from "zod";

export const createDisabledDateSchema = z.object({
    businessId: z.string().min(1, "ID de negocio requerido"),
    closedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),
    reason: z.string().nullable().optional()
});
