import { Router } from "express";
import { featuredBrandsController, productsController, recommendationsController } from "./controller";

const router = Router();

router.get("/products", productsController);
router.get("/recommendations", recommendationsController);
router.get("/featured-brands", featuredBrandsController);

export default router;
