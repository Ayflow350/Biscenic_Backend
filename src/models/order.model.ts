// src/models/order.model.ts

import mongoose, { Schema, Document } from "mongoose";

// Define the schema for an individual item in the cart
export interface IOrderItem {
  id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
}

// Define the shipping information structure
export interface IShippingInfo {
  address: string;
  city: string;
  state: string; // Assuming state is collected
  country: string;
  postalCode?: string;
  apartment?: string; // Add if collected
}

// Define the payment details structure (minimal)
export interface IPaymentDetails {
  gateway: string; // e.g., 'flutterwave', 'paystack', 'cod'
  reference?: string; // Transaction reference
  status: string; // e.g., 'successful', 'pending', 'failed'
  // ... any other verification data
}

// Main Order Document interface
export interface IOrder extends Document {
  orderId: string; // Unique, human-readable ID (e.g., ORD-12345)
  userId?: mongoose.Schema.Types.ObjectId; // Optional: Link to a user
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "flutterwave" | "paystack" | "cod";

  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };

  shippingInfo: IShippingInfo;
  paymentDetails?: IPaymentDetails;
  items: IOrderItem[];

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Assuming a User model
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      default: "PROCESSING",
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["flutterwave", "paystack", "cod"],
    },

    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: false },
    },

    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: false },
      country: { type: String, required: true },
      postalCode: { type: String, required: false },
    },

    paymentDetails: { type: Object, required: false }, // Store full response from gateway

    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
