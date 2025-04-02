import { Product } from "../models/Product";
import { Review } from "../models/Review";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Request, Response } from "express-serve-static-core";
import { ImageFile } from "../types/types";
import { deleteAssociatedReviews } from "../utils/helpers";

export const createProduct = async (req: Request, res: Response) => {
  req.body.user = req.user!.userId;

  /* To Be Deleted "Start" */

  // const newPrice = Math.floor((req.body.price / 47.38) * 100);
  // req.body.price = newPrice;

  /* To Be Deleted "End" */

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

type QueryObject = {
  name?: {
    $regex: unknown;
    $options: string;
  };
};

export const getPaginatedProducts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let queryObject: QueryObject = {};

    const test = { $regex: search, $options: "i" };
    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(queryObject)
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    res.status(200).json({ products, totalProducts, numOfPages });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new NotFoundError(`No product with id : ${productId}`);
  }

  await deleteAssociatedReviews(product.id, Review);
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};

export const uploadImages = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }

  const productImages = req.files.images as unknown;

  let imagesPath = [];
  let filesData = [];
  let imagesUrls: string[] = [];

  if (productImages) {
    if (Array.isArray(req.files.images)) {
      for (let image of productImages as ImageFile[]) {
        if (!image.mimetype.startsWith("image")) {
          throw new BadRequestError("Please Upload Image");
        }

        const maxSize = 1024 * 1024;

        if (image.size > maxSize) {
          throw new BadRequestError("Please upload image smaller than 1MB");
        }

        /* Cloudinary Setup Start */

        let uploadedFile;
        try {
          uploadedFile = await cloudinary.uploader.upload(image.tempFilePath, {
            use_filename: true,
            folder: "Ecommerce App",
            resource_type: "image",
          });
        } catch (error) {
          res.status(500);
          throw new Error("Image could not be uploaded");
        }

        fs.unlinkSync(image.tempFilePath);

        imagesUrls = [...imagesUrls, uploadedFile.secure_url];

        /* Cloudinary Setup End */
      }
    } else {
      const singleImage = productImages as ImageFile;
      if (!singleImage.mimetype.startsWith("image")) {
        throw new BadRequestError("Please Upload Image");
      }

      const maxSize = 1024 * 1024;

      if (singleImage.size > maxSize) {
        throw new BadRequestError("Please upload image smaller than 1MB");
      }

      /* Cloudinary Setup Start */

      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(
          singleImage.tempFilePath,
          {
            use_filename: true,
            folder: "Ecommerce App",
            resource_type: "image",
          }
        );
      } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }

      fs.unlinkSync(singleImage.tempFilePath);

      imagesUrls = [uploadedFile.secure_url];

      /* Cloudinary Setup End */
    }
  }
  res.status(StatusCodes.OK).json({ images: imagesUrls });
};

// const uploadImage = async (req:Request, res: Response) => {
//   if (!req.files) {
//     throw new BadRequestError("No File Uploaded");
//   }

//   const productImage = req.files.image;

//   if (!productImage.mimetype.startsWith("image")) {
//     throw new BadRequestError("Please Upload Image");
//   }

//   const maxSize = 1024 * 1024;

//   if (productImage.size > maxSize) {
//     throw new BadRequestError(
//       "Please upload image smaller than 1MB"
//     );
//   }

//   const imagePath = path.join(
//     __dirname,
//     "../public/uploads/" + `${productImage.name}`
//   );
//   await productImage.mv(imagePath);

//   res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
// };

export const getProductsStats = async (req: Request, res: Response) => {
  const products = await Product.find();

  const productsValues: number[] = [];
  const productsQuantities = [];
  const productsCategories: string[] = [];

  products.map((product) => {
    const { price, inventory, category } = product;
    const productValue = price * inventory;

    return (
      productsValues.push(productValue),
      productsQuantities.push(inventory),
      productsCategories.push(category)
    );
  });

  let storeValue = productsValues.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  // storeValue = Number(storeValue.toFixed(4))

  const uniqueCategoriesCount = [...new Set(productsCategories)].length;

  const outOfStockCount = products.filter(
    (product) => product.inventory < 1
  ).length;

  res.status(200).json({
    storeValue,
    outOfStock: outOfStockCount,
    categoriesCount: uniqueCategoriesCount,
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getPaginatedProducts,
  getProductsStats,
};
