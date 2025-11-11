import express from "express";
import {
  initiatePayment,
  verifyPayment,
  createOrder,
} from "../controllers/payment.controller";

const router = express.Router();

router.post("/initialize", initiatePayment);
router.get("/verify", verifyPayment);
router.post("/create-order", createOrder);

export default router;
