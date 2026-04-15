import { Router } from "express";
import ClientController from "../controllers/ClientController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { createClientSchema, updateClientSchema } from "../schemas/clientSchemas";

const routerClients = Router();

routerClients.get("/", checkAuth, ClientController.getAll);
routerClients.get("/:id", checkAuth, ClientController.getById);
routerClients.post("/", checkAuth, validateData(createClientSchema), ClientController.create);
routerClients.put("/:id", checkAuth, validateData(updateClientSchema), ClientController.update);
routerClients.delete("/:id", checkAuth, ClientController.delete);

export default routerClients;
