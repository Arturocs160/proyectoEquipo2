import { z } from "zod";

export const createBranchSchema = z.object({
    businessId: z.string().min(1, "ID de negocio requerido"),
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").regex(/^\+?[0-9]+$/, "Solo se permiten dígitos y el símbolo +")
});

export const updateBranchSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").regex(/^\+?[0-9]+$/, "Solo se permiten dígitos y el símbolo +")
});
