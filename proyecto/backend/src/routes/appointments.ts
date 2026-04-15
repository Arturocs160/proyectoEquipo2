import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { createAppointmentSchema, updateAppointmentStatusSchema } from "../schemas/appointmentSchemas";

const routerAppointments = Router();

routerAppointments.get("/", checkAuth, AppointmentController.getAllWithDetails);
routerAppointments.get("/search", AppointmentController.searchByBooker);
routerAppointments.get("/availability", AppointmentController.getAvailability);
routerAppointments.get("/:id", checkAuth, AppointmentController.getById);
routerAppointments.post("/", validateData(createAppointmentSchema), AppointmentController.create);
routerAppointments.put("/:id/status", checkAuth, validateData(updateAppointmentStatusSchema), AppointmentController.updateStatus);
routerAppointments.delete("/:id", checkAuth, AppointmentController.delete);

export default routerAppointments;
