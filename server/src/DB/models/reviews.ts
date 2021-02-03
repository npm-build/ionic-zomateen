import { Schema, model, Document } from "mongoose";

export interface ReviewsType extends Document {
  usn: string;
  foodId: number;
  review: string;
}

export const ReviewsSchema: Schema = new Schema({
  usn: { type: String, required: true },
  foodId: { type: Number, required: true },
  review: { type: String, required: true },
});

export const ReviewsModel = model<ReviewsType>("reviews", ReviewsSchema);
