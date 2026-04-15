import { Router } from "express";
import ServiceController from "../controllers/ServiceController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { createServiceSchema, updateServiceSchema } from "../schemas/serviceSchemas";
import upload from "../config/multer";

const routerServices = Router();

routerServices.get("/", ServiceController.getAll);
routerServices.get("/business/:businessId", ServiceController.getByBusinessId);
routerServices.get("/:id", ServiceController.getById);
// Importante: Multer sube la imagen primero ("image"), luego Zod valida y finalmente pasa al ServiceController.
routerServices.post("/", checkAuth, upload.single("image"), validateData(createServiceSchema), ServiceController.create);
routerServices.put("/:id", checkAuth, upload.single("image"), validateData(updateServiceSchema), ServiceController.update);
routerServices.delete("/:id", checkAuth, ServiceController.delete);

export default routerServices;
