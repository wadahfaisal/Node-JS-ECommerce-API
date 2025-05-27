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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        default: 0,
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    // image: {
    //   type: String,
    //   default: "/uploads/example.jpeg",
    //   require: true,
    // },
    images: {
        type: [String],
        default: [
            "https://res.cloudinary.com/dk0ern5dq/image/upload/v1711700004/Ecommerce%20App/tmp-1-1711700002353_mhubol.jpg",
        ],
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        // enum: ["office", "kitchen", "bedroom"],
        enum: [
            "office",
            "kitchen",
            "bedroom",
            "men",
            "t-shirt",
            "trousers",
            "jeans",
            "shoes",
        ],
    },
    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            // values: ["ikea", "liddy", "marcos"],
            values: ["ikea", "liddy", "marcos", "lacoste", "mobaco", "zara"],
            message: "{VALUE} is not supported as a company name",
        },
    },
    // sizes: {
    //   type: [String],
    //   required: [true, "Please provide size"],
    //   enum: {
    //     values: ["xs", "s", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl", "6xl"],
    //     message: "{VALUE} is not supported as a size",
    //   },
    // },
    sizes: {
        // type: [Schema.Types.Mixed],
        type: [mongoose_1.default.Schema.Types.Mixed],
        required: [true, "Please provide size"],
        // enum: {
        //   values: ["xs", "s", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl", "6xl"],
        //   message: "{VALUE} is not supported as a size",
        // },
    },
    colors: {
        type: [String],
        default: ["#222"],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
ProductSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false,
});
// ProductSchema.pre(
//   "deleteOne",
//   async function (this: ProductDocument, next: (err?: Error) => void) {
//     await this.model("Review").deleteMany({ product: this._id });
//   }
// );
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
