import Payment from "../models/payment.model";
import { CURRENCY_CONFIG, SupportedCurrency } from "../config/currency.config";

export class PaymentService {
  static async createPayment(paymentData: {
    user: string;
    order: string;
    amount: number;
    currency?: SupportedCurrency;
    paymentMethod: string;
    transactionReference: string;
  }) {
    const {
      user,
      order,
      amount,
      currency = CURRENCY_CONFIG.DEFAULT_CURRENCY,
      paymentMethod,
      transactionReference,
    } = paymentData;

    const existingPayment = await Payment.findOne({ transactionReference });
    if (existingPayment) {
      throw new Error("Transaction reference already exists");
    }

    const payment = new Payment({
      user,
      order,
      amount,
      currency,
      paymentMethod,
      transactionReference,
    });

    await payment.save();
    return payment;
  }

  static async getPaymentsByUser(userId: string) {
    return await Payment.find({ user: userId })
      .populate("order")
      .sort({ createdAt: -1 });
  }

  static async getPaymentByReference(transactionReference: string) {
    return await Payment.findOne({ transactionReference })
      .populate("order")
      .populate("user");
  }

  static async updatePaymentStatus(
    transactionReference: string,
    status: string
  ) {
    return await Payment.findOneAndUpdate(
      { transactionReference },
      { status },
      { new: true }
    );
  }
}
