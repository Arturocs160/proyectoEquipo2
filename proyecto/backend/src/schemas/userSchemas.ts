import { z } from "zod";

export const userRegisterSchema = z.object({
    full_name: z.string("Formato inválido").min(8, "El nombre debe tener minimo 8 carácteres").regex(/^[a-zA-ZÑñÁáÉéÍíÓóÚú ]+$/, "El nombre debe contener solo letras"),
    email: z.email("Correo de formato inválido"),
    password: z.string("Formato inválido").min(8, "La contraseña debe tener minimo 8 carácteres").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
    phone: z.string().min(10, "Número inválido (mínimo 10 dígitos)").regex(/^\+?[0-9]+$/, "El número debe contener solo dígitos"),
})

export const userLoginSchema = z.object({
    email: z.email("Correo de formato inválido"),
    password: z.string("Formato inválido").min(8, "La contraseña debe tener minimo 8 carácteres").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
})

