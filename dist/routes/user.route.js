import { Router } from "express";
import { getUserHandler, getAllUsersHandler, getCurrentUserHandler, // 👈 new import
 } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "../types/user.types";
const router = Router();
// ✅ Admin-only: Get all users
router.get("/", authenticate, authorize([UserRole.ADMIN]), getAllUsersHandler);
// ✅ Get a specific user by ID (for any authenticated user)
router.get("/:id", authenticate, getUserHandler);
// ✅ NEW: Get the currently logged-in user (from JWT)
router.get("/me/profile", authenticate, getCurrentUserHandler);
export default router;
//# sourceMappingURL=user.route.js.map