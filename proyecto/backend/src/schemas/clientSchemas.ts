import { z } from "zod";

export const createClientSchema = z.object({
    fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo inválido").nullable().optional(),
    phone: z.string().min(10, "El teléfono debe tener minimo 10 dígitos").regex(/^\+?[0-9]+$/, "Solo se permiten dígitos y el símbolo +")
});

export const updateClientSchema = z.object({
    fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Correo inválido").nullable().optional(),
    phone: z.string().min(10, "El teléfono debe tener minimo 10 dígitos").regex(/^\+?[0-9]+$/, "Solo se permiten dígitos y el símbolo +")
});
