import { Schema, model, Document } from "mongoose";

export interface UserType extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  usn: string;
  password: string;
  phone: number;
  noOfCancels: number;
  favorites: number[];
  cartItems: number[];
  isAdmin: boolean;
}

export const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  noOfCancels: { type: Number, default: 0 },
  favorites: [{ type: Number }],
  cartItems: [{ type: Number }],
  isAdmin: { type: Boolean, default: false },
});

// Creating the Models
export const userModel = model<UserType>("user", userSchema);
