import { Router } from "express";
import BusinessHoursController from "../controllers/BusinessHoursController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { upsertBusinessHoursSchema } from "../schemas/businessHoursSchemas";

const routerBusinessHours = Router();

routerBusinessHours.get("/:businessId", BusinessHoursController.getByBusinessId);
routerBusinessHours.post("/upsert", checkAuth, validateData(upsertBusinessHoursSchema), BusinessHoursController.upsert);

export default routerBusinessHours;
