import mongoose, { Schema, Document } from "mongoose";
import { CURRENCY_CONFIG, SupportedCurrency } from "../config//currency.config";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  amount: number; // Stays as 'amount', but should store kobo/cents
  currency: SupportedCurrency;
  paymentMethod: "paystack" | "flutterwave"; // Kept the name, but updated the allowed values
  status: "pending" | "completed" | "failed";
  transactionReference: string;
  gatewayResponse?: any; // Added this for audit/debugging purposes
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      // <-- KEPT AS REQUESTED
      type: Number,
      required: true,
      min: 0,
      comment:
        "Should store amount in the smallest currency unit (e.g., Kobo) to avoid float errors.",
    },
    currency: {
      type: String,
      enum: CURRENCY_CONFIG.SUPPORTED_CURRENCIES,
      default: CURRENCY_CONFIG.DEFAULT_CURRENCY,
      required: true,
    },
    paymentMethod: {
      // <-- KEPT THE NAME, BUT UPDATED THE VALUES
      type: String,
      enum: ["paystack", "flutterwave"], // More accurate for your use case
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionReference: {
      type: String,
      unique: true,
      required: true,
    },
    gatewayResponse: {
      // <-- EXPLAINED BELOW
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
