import { Schema, model, Document } from "mongoose";
import autoIncrement from "mongoose-auto-increment";

import { db } from "../db";

export interface OrderType extends Document {
  foodIds: number[];
  customerName: string;
  usn: string;
  orderId: number;
  messages: string;
  status: string;
  isCompleted: boolean;
  dateOfOrder: Date;
  paid: boolean;
  paymentMode: string;
}

export const OrderSchema: Schema = new Schema({
  foodIds: [{ type: Number, required: true }],
  customerName: { type: String, required: true },
  usn: { type: String, required: true },
  orderId: { type: Number, default: 0 },
  messages: String,
  status: { type: String, default: "pending" },
  isCompleted: { type: Boolean, default: false },
  dateOfOrder: { type: Date, default: Date() },
  paid: { type: Boolean, default: false },
  paymentMode: { type: String, required: true },
});

autoIncrement.initialize(db);

OrderSchema.plugin(autoIncrement.plugin, {
  model: "order",
  field: "orderId",
  startAt: 1,
  incrementBy: 1,
});

export const OrderModel = model<OrderType>("order", OrderSchema);
