import { Router } from "express";
import BusinessInfoController from "../controllers/BusinessInfoController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { updateBusinessInfoSchema } from "../schemas/businessInfoSchemas";
import upload from "../config/multer";

const routerBusinessInfo = Router();

routerBusinessInfo.get("/:businessId", BusinessInfoController.getInfo);
routerBusinessInfo.get("/slug/:slug", BusinessInfoController.getBySlug);
routerBusinessInfo.post("/", checkAuth, upload.single("logo"), validateData(updateBusinessInfoSchema), BusinessInfoController.create);
routerBusinessInfo.put("/business/:businessId", checkAuth, upload.single("logo"), validateData(updateBusinessInfoSchema), BusinessInfoController.update);

export default routerBusinessInfo;
