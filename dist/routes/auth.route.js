import { Router } from "express";
import { signUpHandler, signInHandler } from "../controllers/auth.controller";
const router = Router();
router.post("/signup", signUpHandler);
router.post("/signin", signInHandler);
export default router;
//# sourceMappingURL=auth.route.js.map