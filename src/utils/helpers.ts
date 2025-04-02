import mongoose, { Model, ObjectId } from "mongoose";
import { ReviewDocument } from "../models/Review";
import { ProductDocument } from "../models/Product";

export const deleteAssociatedReviews = async (
  productId: string,
  reviewModel: Model<ReviewDocument>
) => {
  await reviewModel.deleteMany({ product: productId });
};

export const calculateAverageRating = async (
  productId: mongoose.Types.ObjectId,
  reviewModel: Model<ReviewDocument>,
  productModel: Model<ProductDocument>
) => {
  const result = await reviewModel.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  console.log({ calculateAverageRating: result });

  try {
    const p = await productModel.findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      },
      { new: true }
    );
    // console.log({ calculateAverageRating: p });
  } catch (error) {
    console.log(error);
  }
};
