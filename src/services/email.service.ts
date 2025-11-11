// src/services/email.service.ts (FINAL VERSION)

import * as nodemailer from "nodemailer";
import { IOrder } from "../models/order.model";

// --- CONNECTION SETUP (Relying on ENV) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- EMAIL ADDRESSES ---
// This is the authenticated address (soluwatist@gmail.com)
const authenticatedSenderEmail =
  process.env.STORE_EMAIL || "notifications@biscenic.com";

// This is the owner's recipient address (Biscenic@gmail.com)
const adminRecipientEmail = process.env.ADMIN_EMAIL || "admin@biscenic.com";

export class EmailService {
  /**
   * Sends the order confirmation email to the customer.
   * FROM: soluwatist@gmail.com
   * TO: customer.email
   */
  static async sendCustomerConfirmation(order: IOrder): Promise<void> {
    const mailOptions = {
      from: `"Biscenic Store" <${authenticatedSenderEmail}>`, // Using authenticated address
      to: order.customerInfo.email,
      subject: `Your Order Confirmation #${order.orderId}`,
      html: `
                <h1>Thank you for your order, ${order.customerInfo.name}!</h1>
                <p>Your order ID is: <strong>${order.orderId}</strong>.</p>
                <p>We've received your order and are processing it now.</p>
                <p><strong>Total:</strong> ${order.totalAmount.toLocaleString()} NGN</p>
                <p><strong>Shipping To:</strong> ${
                  order.shippingInfo.address
                }, ${order.shippingInfo.city}</p>
                <hr>
                <!-- Include item list logic here -->
            `,
    };

    await transporter.sendMail(mailOptions);
  }

  /**
   * Sends a new order notification to the store owner/admin.
   * FROM: soluwatist@gmail.com
   * TO: Biscenic@gmail.com
   */
  static async sendAdminNotification(order: IOrder): Promise<void> {
    const mailOptions = {
      from: `"Biscenic Notifications" <${authenticatedSenderEmail}>`, // Using authenticated address
      to: adminRecipientEmail, // Sending to the owner's preferred address
      subject: `🚨 NEW ORDER RECEIVED: #${order.orderId}`,
      html: `
                <h1>New Order Alert!</h1>
                <p>Order ID: <strong>${order.orderId}</strong></p>
                <p>Total: <strong>${order.totalAmount.toLocaleString()} NGN</strong></p>
                <p>Customer: ${order.customerInfo.name} (${
        order.customerInfo.email
      })</p>
                <p>Payment: ${order.paymentMethod.toUpperCase()}</p>
                <hr>
                <p>Please log into the dashboard to fulfill the order.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
  }
}
