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
exports.calculateAverageRating = exports.deleteAssociatedReviews = void 0;
const deleteAssociatedReviews = (productId, reviewModel) => __awaiter(void 0, void 0, void 0, function* () {
    yield reviewModel.deleteMany({ product: productId });
});
exports.deleteAssociatedReviews = deleteAssociatedReviews;
const calculateAverageRating = (productId, reviewModel, productModel) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield reviewModel.aggregate([
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
        const p = yield productModel.findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0),
            numOfReviews: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.numOfReviews) || 0,
        }, { new: true });
        // console.log({ calculateAverageRating: p });
    }
    catch (error) {
        console.log(error);
    }
});
exports.calculateAverageRating = calculateAverageRating;
