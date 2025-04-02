import mongoose, { Document, model, Schema, Types } from "mongoose";

const SingleOrderItemSchema = new Schema({
  name: { type: String, required: true },
  images: { type: [String], required: true },
  // image: { type: String, required: true},
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

export interface IOrderItem {
  name: string;
  images: string[];
  price: number;
  amount: number;
  product: Types.ObjectId;
}

interface IOrder {
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: IOrderItem[];
  status: "pending" | "failed" | "paid" | "delivered" | "canceled";
  user: Types.ObjectId;
  clientSecret: string;
  paymentIntentId: string;
}

export interface OrderDocument extends IOrder, Document {
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = model<OrderDocument>("Order", OrderSchema);
