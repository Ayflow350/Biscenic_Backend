// src/services/order.service.ts

import Order, { IOrder } from "../models/order.model";
import { EmailService } from "./email.service";
import mongoose from "mongoose";
const { v4: uuidv4 } = require("uuid"); // For generating a unique identifier

// Helper to generate a human-readable ID
const generateReadableOrderId = (): string => {
  // Generate a unique 8-character string, or use a sequence number system
  const uniqueId = uuidv4().substring(0, 8).toUpperCase();
  return `ORD-${uniqueId}`;
};

export class OrderService {
  /**
   * Saves the order to the database and triggers email notifications.
   */
  static async createOrderAndNotify(
    orderData: any,
    userId?: string
  ): Promise<OrderServiceResult> {
    // --- Transaction/Atomicity Start ---
    // In a real system, you would start a DB transaction here.

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Generate ID and Determine Final Status
      const orderId = generateReadableOrderId();
      const finalStatus =
        orderData.paymentMethod === "cod" ? "PENDING" : "PROCESSING";

      // 2. Create Order Document
      const orderDoc = new Order({
        orderId: orderId,
        userId: userId, // Pass the optional user ID
        status: finalStatus,
        ...orderData,
      });

      // 3. Save to Database
      const savedOrder = await orderDoc.save({ session });

      // 4. Send Emails (Concurrent non-blocking tasks)
      await Promise.all([
        EmailService.sendCustomerConfirmation(savedOrder),
        EmailService.sendAdminNotification(savedOrder),
      ]);

      // 5. Commit Transaction
      await session.commitTransaction();
      // --- Transaction/Atomicity End ---

      return { orderId: orderId };
    } catch (error) {
      await session.abortTransaction();
      console.error("OrderService Error:", error);
      throw new Error("Order creation failed on the backend.");
    } finally {
      session.endSession();
    }
  }
}

interface OrderServiceResult {
  orderId: string;
}
