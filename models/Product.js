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
      default: ["/uploads/example.jpeg"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      // enum: ["office", "kitchen", "bedroom"],
      enum: ["office", "kitchen", "bedroom", "men"],
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        // values: ["ikea", "liddy", "marcos"],
        values: ["ikea", "liddy", "marcos", "lacoste", "mobaco"],
        message: "{VALUE} is not supported",
      },
    },
    sizes: {
      type: [String],
      required: [true, "Please provide size"],
      default: ["s"],
      enum: {
        values: ["xs", "s", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl", "6xl"],
        message: "{VALUE} is not supported",
      },
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
