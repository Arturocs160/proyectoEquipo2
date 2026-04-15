import bcrypt from "bcrypt";
import pool from "../config/db";

type InsertResult = {
    insertId: number;
};

async function tableHasData(): Promise<boolean> {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users");
    const total = (rows as any[])[0]?.total ?? 0;
    return Number(total) > 0;
}

async function seedDatabase(force = false) {
    const hasData = await tableHasData();

    if (hasData && !force) {
        console.log("La base de datos ya contiene datos. Usa --force para reseed.");
        return;
    }

    const ownerId = "f6c2bb99-3e40-4899-a6ca-911f2bc29c17";
    const ownerPassword = await bcrypt.hash("Owner123*", 10);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        if (force) {
            // Delete in FK-safe order for a clean reseed.
            await connection.query("DELETE FROM appointments");
            await connection.query("DELETE FROM employees");
            await connection.query("DELETE FROM disabled_dates");
            await connection.query("DELETE FROM business_hours");
            await connection.query("DELETE FROM services");
            await connection.query("DELETE FROM branches");
            await connection.query("DELETE FROM business_info");
            await connection.query("DELETE FROM users");
            await connection.query("DELETE FROM revoked_tokens");
        }

        await connection.query(
            `INSERT INTO users (id, full_name, email, phone, password, role)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [ownerId, "Admin Demo", "admin../demo.com", "3000000000", ownerPassword, "owner"]
        );

        const [businessResult] = await connection.query(
            `INSERT INTO business_info (owner_id, slug, logo_url, name, specialty, description, location, rating)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ownerId,
                "barberia-demo",
                null,
                "Barberia Demo",
                "Barberia",
                "Negocio de ejemplo para pruebas y demos.",
                "Calle 10 #20-30, Bogota",
                "4.8"
            ]
        );

        const businessId = (businessResult as InsertResult).insertId;

        const [branchMainResult] = await connection.query(
            `INSERT INTO branches (business_id, name, address, phone)
             VALUES (?, ?, ?, ?)`,
            [businessId, "Sucursal Centro", "Calle 10 #20-30, Bogota", "3000000001"]
        );
        const branchMainId = (branchMainResult as InsertResult).insertId;

        const [branchNorthResult] = await connection.query(
            `INSERT INTO branches (business_id, name, address, phone)
             VALUES (?, ?, ?, ?)`,
            [businessId, "Sucursal Norte", "Carrera 15 #100-20, Bogota", "3000000002"]
        );
        const branchNorthId = (branchNorthResult as InsertResult).insertId;

        const [cutServiceResult] = await connection.query(
            `INSERT INTO services (business_id, name, description, duration_minutes, price, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [businessId, "Corte clasico", "Corte tradicional para caballero", 45, 25000, null]
        );
        const cutServiceId = (cutServiceResult as InsertResult).insertId;

        const [beardServiceResult] = await connection.query(
            `INSERT INTO services (business_id, name, description, duration_minutes, price, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [businessId, "Arreglo de barba", "Perfilado y arreglo completo de barba", 30, 18000, null]
        );
        const beardServiceId = (beardServiceResult as InsertResult).insertId;

        for (let day = 1; day <= 6; day++) {
            await connection.query(
                `INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_active)
                 VALUES (?, ?, ?, ?, ?)`,
                [businessId, day, "08:00:00", "18:00:00", 1]
            );
        }

        await connection.query(
            `INSERT INTO business_hours (business_id, day_of_week, open_time, close_time, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [businessId, 0, null, null, 0]
        );

        await connection.query(
            `INSERT INTO disabled_dates (business_id, closed_date, reason)
             VALUES (?, ?, ?)`,
            [businessId, "2026-12-25", "Navidad"]
        );

        const [employee1Result] = await connection.query(
            `INSERT INTO employees (branch_id, full_name, email, age, specialty, is_active)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [branchMainId, "Carlos Perez", "carlos../demo.com", 29, "Corte clasico", 1]
        );
        const employee1Id = (employee1Result as InsertResult).insertId;

        const [employee2Result] = await connection.query(
            `INSERT INTO employees (branch_id, full_name, email, age, specialty, is_active)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [branchNorthId, "Laura Gomez", "laura../demo.com", 31, "Barba y perfilado", 1]
        );
        const employee2Id = (employee2Result as InsertResult).insertId;

        await connection.query(
            `INSERT INTO appointments (
                branch_id,
                employee_id,
                service_id,
                scheduled_at,
                status,
                booker_name,
                booker_email,
                booker_phone,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                branchMainId,
                employee1Id,
                cutServiceId,
                "2026-04-15 10:00:00",
                "confirmed",
                "Cliente Demo",
                "cliente1../correo.com",
                "3110000001",
                "Prefiere corte corto"
            ]
        );

        await connection.query(
            `INSERT INTO appointments (
                branch_id,
                employee_id,
                service_id,
                scheduled_at,
                status,
                booker_name,
                booker_email,
                booker_phone,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                branchNorthId,
                employee2Id,
                beardServiceId,
                "2026-04-16 14:30:00",
                "pending",
                "Cliente Prueba",
                "cliente2../correo.com",
                "3110000002",
                "Primera visita"
            ]
        );

        await connection.commit();

        console.log("Seed completado correctamente.");
        console.log("Usuario owner: admin../demo.com / Owner123*");
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

const force = process.argv.includes("--force");

seedDatabase(force)
    .catch((error) => {
        console.error("Error ejecutando seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
