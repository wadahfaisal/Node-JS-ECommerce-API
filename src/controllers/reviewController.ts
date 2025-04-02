import { Review } from "../models/Review";
import { Product } from "../models/Product";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors";
import { checkPermissions } from "../utils";
import { Request, Response } from "express-serve-static-core";
import { calculateAverageRating } from "../utils/helpers";

export const createReview = async (req: Request, res: Response) => {
  const { product: productId } = req.body;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user!.userId,
  });

  if (alreadySubmitted) {
    throw new BadRequestError("Already submitted review for this product");
  }

  req.body.userId = req.user!.userId;
  req.body.username = req.user!.name;

  const review = await Review.create(req.body);
  await calculateAverageRating(product.id, Review, Product);

  res.status(StatusCodes.CREATED).json({ review });
};

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export const getSingleReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

export const updateReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user!, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user!, review.user);
  // await review.remove();
  await review.deleteOne();
  await calculateAverageRating(review.product, Review, Product);

  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

export const getSingleProductReviews = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
