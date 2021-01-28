import { Schema, model, Document } from "mongoose";

export interface AdminType extends Document {
  collegeId: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  phone: number;
  isAdmin: boolean;
}

export const AdminSchema: Schema = new Schema({
  collegeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  isAdmin: { type: Boolean, default: true },
});

export const AdminModel = model<AdminType>("admin", AdminSchema);
