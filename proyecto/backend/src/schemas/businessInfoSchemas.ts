import { z } from "zod";

export const updateBusinessInfoSchema = z.object({
    name: z.string().min(3, "El nombre del negocio debe tener al menos 3 caracteres"),
    specialty: z.string().min(3, "Especialidad mínima de 3 caracteres").nullable().optional(),
    description: z.string().min(10, "La descripción debe ser más detallada").nullable().optional(),
    location: z.string().min(5, "La ubicación debe ser válida").nullable().optional(),
    rating: z.string().nullable().optional(),
    // logo_url se maneja por multer si es archivo, o se acepta opcionalmente
    logo_url: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional()
});
