"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductReviews = exports.deleteReview = exports.updateReview = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const Review_1 = require("../models/Review");
const Product_1 = require("../models/Product");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const helpers_1 = require("../utils/helpers");
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product: productId } = req.body;
    const product = yield Product_1.Product.findOne({ _id: productId });
    if (!product) {
        throw new errors_1.NotFoundError(`No product with id : ${productId}`);
    }
    const alreadySubmitted = yield Review_1.Review.findOne({
        product: productId,
        user: req.user.userId,
    });
    if (alreadySubmitted) {
        throw new errors_1.BadRequestError("Already submitted review for this product");
    }
    req.body.userId = req.user.userId;
    req.body.username = req.user.name;
    const review = yield Review_1.Review.create(req.body);
    yield (0, helpers_1.calculateAverageRating)(product.id, Review_1.Review, Product_1.Product);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ review });
});
exports.createReview = createReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.Review.find({}).populate({
        path: "product",
        select: "name company price",
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getAllReviews = getAllReviews;
const getSingleReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const review = yield Review_1.Review.findOne({ _id: reviewId });
    if (!review) {
        throw new errors_1.NotFoundError(`No review with id ${reviewId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.getSingleReview = getSingleReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const review = yield Review_1.Review.findOne({ _id: reviewId });
    if (!review) {
        throw new errors_1.NotFoundError(`No review with id ${reviewId}`);
    }
    (0, utils_1.checkPermissions)(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    yield review.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: reviewId } = req.params;
    const review = yield Review_1.Review.findOne({ _id: reviewId });
    if (!review) {
        throw new errors_1.NotFoundError(`No review with id ${reviewId}`);
    }
    (0, utils_1.checkPermissions)(req.user, review.user);
    // await review.remove();
    yield review.deleteOne();
    yield (0, helpers_1.calculateAverageRating)(review.product, Review_1.Review, Product_1.Product);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Success! Review removed" });
});
exports.deleteReview = deleteReview;
const getSingleProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const reviews = yield Review_1.Review.find({ product: productId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
});
exports.getSingleProductReviews = getSingleProductReviews;
