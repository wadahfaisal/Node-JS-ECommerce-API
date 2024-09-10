const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
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
      type: [mongoose.Schema.Types.Mixed],
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
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
