import { Schema, model, Document } from "mongoose";

export interface RefreshTokenType extends Document {
  token: string;
  usn: string;
}

export const refreshTokenSchema: Schema = new Schema({
  token: { type: String, required: true, unique: true },
  usn: { type: String, required: true, unique: true },
});

// Creating the Models
export const refreshTokenModel = model<RefreshTokenType>(
  "refreshToken",
  refreshTokenSchema
);
