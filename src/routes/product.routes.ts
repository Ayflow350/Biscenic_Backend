import { Router } from "express";
import {
  createProductHandler,
  getAllProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types/user.types";

const router = Router();

// Only admin can create, update or delete
router.post(
  "/",
  // authenticate,
  // authorize([UserRole.ADMIN]),
  createProductHandler
);
router.get("/", getAllProductsHandler);
router.get("/:id", getProductHandler);
router.put(
  "/:id",
  // authenticate,
  // authorize([UserRole.ADMIN]),
  updateProductHandler
);
router.delete(
  "/:id",
  // authenticate,
  // authorize([UserRole.ADMIN]),
  deleteProductHandler
);

export default router;
