import { Router } from "express";
import UserController from "@controllers/UserController";
import { checkAuth } from "@middlewares/checkAuth";
import { validateData } from "@middlewares/validateData";
import { updateUserRoleSchema } from "@schemas/userSchemas";

const routerUsers = Router();

routerUsers.get("/", checkAuth, UserController.getAll);
routerUsers.put("/:id/role", checkAuth, validateData(updateUserRoleSchema), UserController.updateRole);
routerUsers.delete("/:id", checkAuth, UserController.deleteUser);

export default routerUsers;
