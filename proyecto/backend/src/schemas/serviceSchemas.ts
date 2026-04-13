import { z } from "zod";

export const createServiceSchema = z.object({
    businessId: z.string().min(1, "El ID del negocio es requerido"),
    name: z.string().min(3, "El nombre del servicio debe tener al menos 3 caracteres"),
    description: z.string().nullable().optional(),
    durationMinutes: z.union([z.number().positive(), z.string().regex(/^\d+$/).transform(Number)]),
    price: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)]).nullable().optional(),
    imageUrl: z.string().nullable().optional()
});

export const updateServiceSchema = z.object({
    businessId: z.string().min(1, "El ID del negocio es requerido"),
    name: z.string().min(3, "El nombre del servicio debe tener al menos 3 caracteres"),
    description: z.string().nullable().optional(),
    durationMinutes: z.union([z.number().positive(), z.string().regex(/^\d+$/).transform(Number)]),
    price: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)]).nullable().optional(),
    imageUrl: z.string().nullable().optional()
});
