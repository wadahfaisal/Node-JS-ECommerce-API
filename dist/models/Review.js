"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ReviewSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
}, {
    timestamps: true,
});
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
exports.Review = (0, mongoose_1.model)("Review", ReviewSchema);
