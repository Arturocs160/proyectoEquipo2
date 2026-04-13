import { z } from "zod";

export const createEmployeeSchema = z.object({
    branchId: z.string().min(1, "El ID de la sucursal es requerido"),
    fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    specialty: z.string().nullable().optional(),
    email: z.email("El email es requerido"),
    age: z.number().min(18, "El empleado debe ser mayor de 18 años"),
    isActive: z.union([z.boolean(), z.enum(["true", "false"])]).optional()
});

export const updateEmployeeSchema = z.object({
    branchId: z.string().min(1, "El ID de la sucursal es requerido"),
    fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    specialty: z.string().nullable().optional(),
    age: z.number().min(18, "El empleado debe ser mayor de 18 años"),
    email: z.email("El email es requerido"),
    isActive: z.union([z.boolean(), z.enum(["true", "false"])])
});
