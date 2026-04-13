import { z } from "zod";

export const createAppointmentSchema = z.object({
    branchId: z.number({ error: "ID de la sucursal requerido" })
        .min(1, { error: "ID de la sucursal inválido" }),
    serviceId: z.number({ error: "ID del servicio requerido" })
        .min(1, { error: "ID del servicio inválido" }),
    employeeId: z.number().nullable().optional(),
    day: z.string({ error: "El día es requerido" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Formato de día inválido. Use YYYY-MM-DD" }),
    hour: z.string({ error: "La hora es requerida" })
        .regex(/^\d{2}:\d{2}$/, { error: "Formato de hora inválido. Use HH:MM" }),
    bookerName: z.string({ error: "El nombre es requerido" })
        .min(3, { error: "El nombre debe tener al menos 3 caracteres" }),
    bookerEmail: z.string({ error: "El correo es requerido" })
        .email({ error: "Correo electrónico inválido" }),
    bookerPhone: z.string({ error: "El teléfono es requerido" })
        .min(7, { error: "El teléfono debe tener al menos 7 dígitos" }),
    notes: z.string().nullable().optional(),
});

export const updateAppointmentStatusSchema = z.object({
    status: z.enum(
        ["pending", "confirmed", "cancelled", "completed"],
        { error: "Estado de cita inválido" }
    )
});

export const availabilitySchema = z.object({
    businessId: z.string().min(1, "ID del negocio requerido"),
    serviceId: z.string().min(1, "ID del servicio requerido"),
    branchId: z.string().min(1, "ID de sucursal requerido").optional(),
    employeeId: z.string().min(1, "ID del empleado requerido").optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
});

export const searchAppointmentsSchema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    folio: z.string().optional().transform((value) => {
        if (!value) return undefined;
        const cleaned = value.replace(/#/g, "").trim();
        return cleaned.length > 0 ? cleaned : undefined;
    }).refine((value) => !value || /^\d+$/.test(value), {
        message: "El folio debe ser numérico"
    })
});