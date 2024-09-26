const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  /* To Be Deleted "Start" */

  // const newPrice = Math.floor((req.body.price / 47.38) * 100);
  // req.body.price = newPrice;

  /* To Be Deleted "End" */

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};

const uploadImages = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }

  const productImages = req.files.images;

  let imagesPath = [];
  let filesData = [];
  let imagesUrls = [];

  if (Array.isArray(req.files.images)) {
    for (image of productImages) {
      if (!image.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please Upload Image");
      }

      const maxSize = 1024 * 1024;

      if (image.size > maxSize) {
        throw new CustomError.BadRequestError(
          "Please upload image smaller than 1MB"
        );
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
    if (!productImages.mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Please Upload Image");
    }

    const maxSize = 1024 * 1024;

    if (productImages.size > maxSize) {
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 1MB"
      );
    }

    /* Cloudinary Setup Start */

    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(
        productImages.tempFilePath,
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

    fs.unlinkSync(productImages.tempFilePath);

    imagesUrls = [uploadedFile.secure_url];

    /* Cloudinary Setup End */
  }
  res.status(StatusCodes.OK).json({ images: imagesUrls });
};

// const uploadImage = async (req, res) => {
//   if (!req.files) {
//     throw new CustomError.BadRequestError("No File Uploaded");
//   }

//   const productImage = req.files.image;

//   if (!productImage.mimetype.startsWith("image")) {
//     throw new CustomError.BadRequestError("Please Upload Image");
//   }

//   const maxSize = 1024 * 1024;

//   if (productImage.size > maxSize) {
//     throw new CustomError.BadRequestError(
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

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
};
