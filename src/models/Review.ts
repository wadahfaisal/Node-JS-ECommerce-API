import mongoose, { Document, Model, model, Schema, Types } from "mongoose";

interface IReview {
  rating: number;
  title: string;
  comment: string;
  user: Types.ObjectId;
  username: string;
  product: Types.ObjectId;
}

export interface ReviewDocument extends IReview, Document {
  createdAt: Date;
  updatedAt: Date;
  // calculateAverageRating: (this: IReview, productId: string) => void;
}

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// ReviewSchema.statics.calculateAverageRating = async function (
//   this: Model<ReviewDocument>,
//   productId: string
// ) {
//   const result = await this.aggregate([
//     { $match: { product: productId } },
//     {
//       $group: {
//         _id: null,
//         averageRating: { $avg: "$rating" },
//         numOfReviews: { $sum: 1 },
//       },
//     },
//   ]);

//   try {
//     await this.model("Product").findOneAndUpdate(
//       { _id: productId },
//       {
//         averageRating: Math.ceil(result[0]?.averageRating || 0),
//         numOfReviews: result[0]?.numOfReviews || 0,
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// ReviewSchema.post("save", async function () {
//   await this.constructor.calculateAverageRating(this.product);
// });

// ReviewSchema.post("deleteOne", async function (this: ReviewDocument) {
//   await this.constructor.calculateAverageRating(this.product);
// });

export const Review = model<ReviewDocument>("Review", ReviewSchema);
