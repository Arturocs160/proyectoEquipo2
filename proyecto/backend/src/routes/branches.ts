import { Router } from "express";
import BranchController from "@controllers/BranchController";
import { checkAuth } from "@middlewares/checkAuth";
import { validateData } from "@middlewares/validateData";
import { createBranchSchema, updateBranchSchema } from "@schemas/branchSchemas";

const routerBranches = Router();

routerBranches.get("/business/:businessId", BranchController.getAll);
routerBranches.get("/:id", BranchController.getById);
routerBranches.post("/", checkAuth, validateData(createBranchSchema), BranchController.create);
routerBranches.put("/:id", checkAuth, validateData(updateBranchSchema), BranchController.update);
routerBranches.delete("/:id", checkAuth, BranchController.delete);

export default routerBranches;
