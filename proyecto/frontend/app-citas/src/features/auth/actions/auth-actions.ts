"use server"
export async function registerUser(full_name: string, email: string, password: string, role: string, phone: string) {

    const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password, role, phone }),
    });

    const statusCode = res.status;

    const data = await res.json();

    console.log(res);

    if (!res.ok && data?.details?.length > 0) {
        throw new Error(data?.details[0].message || "Error al registrar usuario");
    } else if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
    }

    return { data, statusCode };
}


export async function signOutBackend(token: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Error al cerrar sesion");
    }

    return data;
}