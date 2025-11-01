import { Router } from "express";
import {
  createCollectionHandler,
  getAllCollectionsHandler,
  getCollectionByIdHandler,
  updateCollectionHandler,
  deleteCollectionHandler,
} from "../controllers/collection.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types/user.types";

const router = Router();

// Only admin can create, update, or delete collections
router.post(
  "/",
  authenticate,
  authorize([UserRole.ADMIN]),
  createCollectionHandler
);
router.get("/", getAllCollectionsHandler);
router.get("/:id", getCollectionByIdHandler);
router.put(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN]),
  updateCollectionHandler
);
router.delete(
  "/:id",
  authenticate,
  authorize([UserRole.ADMIN]),
  deleteCollectionHandler
);

export default router;
