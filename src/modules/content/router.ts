import { Router } from "express";
import { bindCrudRoutes } from "../../shared/moduleFactory";
import { controller } from "./controller";

const router = Router();

bindCrudRoutes(router, controller);

export default router;