import { Schema, model, Document } from "mongoose";

export interface AdminType extends Document {
  collegeId: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  profilePic: string;
  phone: number;
  isAdmin: boolean;
}

export const AdminSchema: Schema = new Schema({
  collegeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  profilePic: {
    type: String,
    required: true,
    unique: true,
    default:
      "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y",
  },
  password: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  isAdmin: { type: Boolean, default: true },
});

export const AdminModel = model<AdminType>("admin", AdminSchema);
