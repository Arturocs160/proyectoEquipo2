import { Request, Response } from "express";
import AppointmentService from "@services/AppointmentService";
import { availabilitySchema, searchAppointmentsSchema } from "@schemas/appointmentSchemas";

class AppointmentController {
    static async searchByBooker(req: Request, res: Response) {
        try {
            const parsed = searchAppointmentsSchema.parse(req.query);
            const appointments = await AppointmentService.searchByBooker(parsed.email, parsed.folio);
            res.status(200).json({ data: appointments });
        } catch (error: any) {
            res.status(400).json({ message: "Error al buscar citas", error: error.message });
        }
    }

    static async getAllWithDetails(req: Request, res: Response) {
        try {
            const branchId = req.query.branchId as string;
            const businessId = req.query.businessId as string;
            const appointments = await AppointmentService.getAllWithDetails(branchId, businessId);
            res.status(200).json({ data: appointments });
        } catch (error: any) {
            res.status(500).json({ message: "Error al obtener las citas", error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const appointment = await AppointmentService.getById(id);
            res.status(200).json({ data: appointment });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { branchId, serviceId, day, hour, bookerName, bookerEmail, bookerPhone, employeeId, notes } = req.body;
            // Combinar día y hora en un datetime de MySQL: "YYYY-MM-DD HH:MM:SS"
            const scheduledAt = `${day} ${hour}:00`;
            const result = await AppointmentService.create(
                branchId, serviceId, scheduledAt,
                bookerName, bookerEmail, bookerPhone,
                employeeId ?? null, notes ?? null
            );
            res.status(201).json({ message: "Cita creada con éxito", data: result });
        } catch (error: any) {
            res.status(500).json({ message: "Error al crear la cita", error: error.message });
        }
    }

    static async getAvailability(req: Request, res: Response) {
        try {
            const parsed = availabilitySchema.parse(req.query);
            const { businessId, serviceId, branchId, employeeId, date } = parsed;

            const availability = await AppointmentService.getAvailability(businessId, serviceId, date, branchId, employeeId);
            res.status(200).json({ data: availability });
        } catch (error: any) {
            res.status(500).json({ message: "Error al consultar disponibilidad", error: error.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { status } = req.body;
            const updated = await AppointmentService.updateStatus(id, status);
            res.status(200).json({ message: "Cita actualizada", data: updated });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await AppointmentService.delete(id);
            res.status(200).json({ message: "Cita eliminada" });
        } catch (error: any) {
            res.status(500).json({ message: "Error interno del servidor", error: error.message });
        }
    }
}

export default AppointmentController;
