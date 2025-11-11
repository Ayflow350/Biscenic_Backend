import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { isValidCurrency } from "../utils/currency.utils";
import { CURRENCY_CONFIG } from "../config/currency.config";
import { OrderService } from "../services/order.service";
const { v4: uuidv4 } = require("uuid");
import Flutterwave from "flutterwave-node-v3";

export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    email,
    amount,
    currency = CURRENCY_CONFIG.DEFAULT_CURRENCY,
    gateway = "paystack",
    name = "Customer",
    phonenumber,
  } = req.body;

  // --- Validations ---
  if (!email || !amount) {
    res.status(400).json({
      message: "Email and amount are required",
      data: null,
      error: true,
    });
    return;
  }
  if (!isValidCurrency(currency)) {
    res.status(400).json({
      message: `Unsupported currency: ${currency}.`,
      data: null,
      error: true,
    });
    return;
  }
  if (amount <= 0) {
    res.status(400).json({
      message: "Invalid amount. Amount must be positive.",
      data: null,
      error: true,
    });
    return;
  }

  try {
    let responseData;

    switch (gateway.toLowerCase()) {
      case "flutterwave":
        const tx_ref = `FW-${uuidv4()}`;

        const flutterwavePayload = {
          tx_ref,
          amount,
          currency: currency.toUpperCase(),
          redirect_url: "http://localhost:3000/order-success",
          customer: {
            email,
            name,
            phonenumber,
          },
          customizations: {
            title: "Biscenic Store",
            description: "Payment for items in your cart",
            logo: "/Biscenic.PNG", // Optional: Replace with your actual logo URL
          },
        };

        // --- THE FIX: Using direct Axios call instead of the SDK ---
        // This is more reliable and matches your Paystack implementation.
        const flutterwaveResponse = await axios.post(
          "https://api.flutterwave.com/v3/payments",
          flutterwavePayload,
          {
            headers: {
              Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (flutterwaveResponse.data.status !== "success") {
          throw new Error("Failed to initialize Flutterwave payment.");
        }

        responseData = {
          // Flutterwave returns the link inside data.data.link
          authorization_url: flutterwaveResponse.data.data.link,
          reference: tx_ref,
          gateway: "flutterwave",
        };
        break;

      case "paystack":
      default:
        const amountInKobo = amount; // Amount is already in Kobo from frontend

        if (amountInKobo > 5000000000) {
          res
            .status(400)
            .json({ message: "Invalid amount.", data: null, error: true });
          return;
        }

        const paystackResponse = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email,
            amount: amountInKobo,
            currency: currency.toUpperCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        responseData = {
          authorization_url: paystackResponse.data.data.authorization_url,
          reference: paystackResponse.data.data.reference,
          gateway: "paystack",
        };
        break;
    }

    res.status(200).json({
      message: "Payment initialization successful",
      data: responseData,
      error: null,
    });
  } catch (error: any) {
    // Improved error logging to see details from Axios errors
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to initialize payment",
      data: null,
      error: error.message,
    });
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { reference, gateway = "paystack" } = req.query as {
    reference: string;
    gateway: string;
  };

  if (!reference) {
    res.status(400).json({
      message: "Transaction reference is required",
      data: null,
      error: true,
    });
    return;
  }

  try {
    let paymentData;
    let isSuccessful = false;

    switch (gateway.toLowerCase()) {
      case "flutterwave":
        const flw = new Flutterwave(
          process.env.FLUTTERWAVE_PUBLIC_KEY as string,
          process.env.FLUTTERWAVE_SECRET_KEY as string
        );

        // flw.Transaction.verify usually works reliably in standard SDK versions
        const flutterwaveResponse = await flw.Transaction.verify({
          id: reference,
        });

        paymentData = flutterwaveResponse.data;
        if (
          flutterwaveResponse.status === "success" &&
          paymentData?.status === "successful"
        ) {
          isSuccessful = true;
        }
        break;

      case "paystack":
      default:
        const paystackResponse = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          }
        );

        paymentData = paystackResponse.data.data;
        if (paymentData?.status === "success") {
          isSuccessful = true;
        }
        break;
    }

    if (isSuccessful) {
      res.status(200).json({
        message: "Payment verification successful",
        data: paymentData,
        error: null,
      });
    } else {
      res.status(400).json({
        message: "Payment verification failed",
        data: paymentData,
        error: true,
      });
    }
  } catch (error: any) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({
      message: "Failed to verify payment",
      data: null,
      error: error.message,
    });
  }
};

// Define the new controller function
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // OrderData includes customerInfo, shippingInfo, items, totalAmount, paymentMethod, and paymentDetails (if paid).
  const orderData = req.body;
  // const userId = req.user?.id; // Assuming user is authenticated and on req.user

  try {
    // Call the service layer to handle DB save and emails
    const result = await OrderService.createOrderAndNotify(
      orderData /*, userId */
    );

    res.status(200).json({
      message: "Order created successfully and confirmation emails sent.",
      data: { orderId: result.orderId },
      error: null,
    });
  } catch (error: any) {
    console.error("Order creation final handler error:", error.message);
    res.status(500).json({
      message: "Failed to create order and send confirmation emails.",
      data: null,
      error: error.message,
    });
  }
};
