// src/services/order.service.ts (Corrected for Session Scoping)

import Order, { IOrder } from "../models/order.model";
import { EmailService } from "./email.service";
import mongoose from "mongoose";
import { ClientSession } from "mongoose"; // 🚨 Import ClientSession for type safety
const { v4: uuidv4 } = require("uuid"); // For generating a unique identifier

// Helper to generate a human-readable ID
const generateReadableOrderId = (): string => {
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
    console.log("LOG: STEP 0.0 - Starting createOrderAndNotify service.");

    let session: ClientSession | undefined; // 🚨 FIX: Declare session outside of try block

    // --- Transaction/Atomicity Start ---
    try {
      console.log("LOG: STEP 0.1 - Starting Mongoose session and transaction.");

      session = await mongoose.startSession(); // 🚨 Assign session here
      session.startTransaction();

      // 1. Generate ID and Determine Final Status
      const orderId = generateReadableOrderId();
      const finalStatus =
        orderData.paymentMethod === "cod" ? "PENDING" : "PROCESSING";

      console.log(
        `LOG: STEP 1.0 - Generated ID: ${orderId}. Status: ${finalStatus}.`
      );

      // 2. Create Order Document
      const orderDoc = new Order({
        orderId: orderId,
        userId: userId,
        status: finalStatus,
        ...orderData,
      });

      // 3. Save to Database (CRITICAL STEP)
      console.log("LOG: STEP 2.0 - Attempting to save order to database...");
      const savedOrder = await orderDoc.save({ session });
      console.log(
        `LOG: STEP 2.1 - Order saved successfully to session (Mongoose ID: ${savedOrder._id}).`
      );

      // 4. Commit Transaction (DB SAVE IS COMPLETE AND ATOMICALLY CONFIRMED)
      console.log(
        "LOG: STEP 3.0 - Attempting to commit transaction to MongoDB..."
      );
      await session.commitTransaction();
      console.log(
        "LOG: STEP 3.1 - Transaction committed successfully. Order is permanent."
      );

      // --- 5. SEND EMAILS (FIRE-AND-FORGET) ---
      console.log(
        "LOG: STEP 4.0 - Initiating fire-and-forget email sending..."
      );

      Promise.all([
        EmailService.sendCustomerConfirmation(savedOrder),
        EmailService.sendAdminNotification(savedOrder),
      ]).catch((emailError) => {
        // Silence email error, but log it
        console.error(
          "LOG: STEP 4.1 - OrderService: Background Email Sending FAILED (Ignored):",
          emailError
        );
      });
      // ----------------------------------------

      console.log("LOG: STEP 5.0 - Returning SUCCESS to controller.");
      return { orderId: orderId };
    } catch (error) {
      // This catch block handles errors from: Validation, Mongoose connection, or Transaction Commit failure.

      console.error(
        "LOG: CATCH 6.0 - ERROR DETECTED. Attempting to abort transaction."
      );

      // 🚨 FIX: Check if session exists AND is in a transaction before aborting
      if (session && session.inTransaction()) {
        await session.abortTransaction();
        console.error("LOG: CATCH 6.1 - Transaction aborted successfully.");
      }

      console.error("LOG: CATCH 6.2 - OrderService: CRITICAL FAILURE:", error);

      // Throw original error back to the controller (which reports to frontend)
      throw new Error("Order creation failed on the backend.");
    } finally {
      // Ensure session is always closed
      console.log("LOG: FINALLY 7.0 - Closing Mongoose session.");
      if (session) {
        session.endSession();
      }
    }
  }
}

interface OrderServiceResult {
  orderId: string;
}
