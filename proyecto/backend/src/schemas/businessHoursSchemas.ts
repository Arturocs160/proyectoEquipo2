import { z } from "zod";

export const upsertBusinessHoursSchema = z.object({
    businessId: z.string().min(1, "ID de negocio requerido"),
    dayOfWeek: z.union([z.number().min(0).max(6), z.string().regex(/^[0-6]$/)]),
    openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Formato de hora incorrecto (HH:MM)").nullable().optional(),
    closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Formato de hora incorrecto (HH:MM)").nullable().optional(),
    isActive: z.union([z.boolean(), z.enum(["true", "false"])])
});
