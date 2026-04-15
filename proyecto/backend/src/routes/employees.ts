import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import { checkAuth } from "../middlewares/checkAuth";
import { validateData } from "../middlewares/validateData";
import { createEmployeeSchema, updateEmployeeSchema } from "../schemas/employeeSchemas";

const routerEmployees = Router();

routerEmployees.get("/", checkAuth, EmployeeController.getAll);
routerEmployees.get("/branch/:branchId", EmployeeController.getByBranchId);
routerEmployees.get("/:id", EmployeeController.getById);
routerEmployees.post("/", checkAuth, validateData(createEmployeeSchema), EmployeeController.create);
routerEmployees.put("/:id", checkAuth, validateData(updateEmployeeSchema), EmployeeController.update);
routerEmployees.delete("/:id", checkAuth, EmployeeController.delete);

export default routerEmployees;
