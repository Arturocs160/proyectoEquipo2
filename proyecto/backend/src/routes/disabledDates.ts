import { Router } from "express";
import DisabledDatesController from "../controllers/DisabledDatesController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { createDisabledDateSchema } from "../schemas/disabledDatesSchemas";

const routerDisabledDates = Router();

routerDisabledDates.get("/:businessId", DisabledDatesController.getByBusinessId);
routerDisabledDates.post("/", checkAuth, validateData(createDisabledDateSchema), DisabledDatesController.create);
routerDisabledDates.delete("/:id", checkAuth, DisabledDatesController.delete);

export default routerDisabledDates;
