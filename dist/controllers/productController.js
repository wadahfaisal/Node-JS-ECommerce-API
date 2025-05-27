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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsStats = exports.uploadImages = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getPaginatedProducts = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = require("../models/Product");
const Review_1 = require("../models/Review");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../utils/helpers");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.user = req.user.userId;
    /* To Be Deleted "Start" */
    // const newPrice = Math.floor((req.body.price / 47.38) * 100);
    // req.body.price = newPrice;
    /* To Be Deleted "End" */
    const product = yield Product_1.Product.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ product });
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, count: products.length });
});
exports.getAllProducts = getAllProducts;
const getPaginatedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        let queryObject = {};
        const test = { $regex: search, $options: "i" };
        if (search) {
            queryObject.name = { $regex: search, $options: "i" };
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const totalProducts = yield Product_1.Product.countDocuments(queryObject);
        const numOfPages = Math.ceil(totalProducts / limit);
        const products = yield Product_1.Product.find(queryObject)
            .sort("-createdAt")
            .limit(limit)
            .skip(skip);
        res.status(200).json({ products, totalProducts, numOfPages });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getPaginatedProducts = getPaginatedProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield Product_1.Product.findOne({ _id: productId }).populate("reviews");
    if (!product) {
        throw new errors_1.NotFoundError(`No product with id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield Product_1.Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new errors_1.NotFoundError(`No product with id : ${productId}`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: productId } = req.params;
    const product = yield Product_1.Product.findOne({ _id: productId });
    if (!product) {
        throw new errors_1.NotFoundError(`No product with id : ${productId}`);
    }
    yield (0, helpers_1.deleteAssociatedReviews)(product.id, Review_1.Review);
    yield product.deleteOne();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Success! Product removed." });
});
exports.deleteProduct = deleteProduct;
const uploadImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        throw new errors_1.BadRequestError("No File Uploaded");
    }
    const productImages = req.files.images;
    let imagesPath = [];
    let filesData = [];
    let imagesUrls = [];
    if (productImages) {
        if (Array.isArray(req.files.images)) {
            for (let image of productImages) {
                if (!image.mimetype.startsWith("image")) {
                    throw new errors_1.BadRequestError("Please Upload Image");
                }
                const maxSize = 1024 * 1024;
                if (image.size > maxSize) {
                    throw new errors_1.BadRequestError("Please upload image smaller than 1MB");
                }
                /* Cloudinary Setup Start */
                let uploadedFile;
                try {
                    uploadedFile = yield cloudinary_1.v2.uploader.upload(image.tempFilePath, {
                        use_filename: true,
                        folder: "Ecommerce App",
                        resource_type: "image",
                    });
                }
                catch (error) {
                    res.status(500);
                    throw new Error("Image could not be uploaded");
                }
                fs_1.default.unlinkSync(image.tempFilePath);
                imagesUrls = [...imagesUrls, uploadedFile.secure_url];
                /* Cloudinary Setup End */
            }
        }
        else {
            const singleImage = productImages;
            if (!singleImage.mimetype.startsWith("image")) {
                throw new errors_1.BadRequestError("Please Upload Image");
            }
            const maxSize = 1024 * 1024;
            if (singleImage.size > maxSize) {
                throw new errors_1.BadRequestError("Please upload image smaller than 1MB");
            }
            /* Cloudinary Setup Start */
            let uploadedFile;
            try {
                uploadedFile = yield cloudinary_1.v2.uploader.upload(singleImage.tempFilePath, {
                    use_filename: true,
                    folder: "Ecommerce App",
                    resource_type: "image",
                });
            }
            catch (error) {
                res.status(500);
                throw new Error("Image could not be uploaded");
            }
            fs_1.default.unlinkSync(singleImage.tempFilePath);
            imagesUrls = [uploadedFile.secure_url];
            /* Cloudinary Setup End */
        }
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ images: imagesUrls });
});
exports.uploadImages = uploadImages;
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
const getProductsStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.Product.find();
    const productsValues = [];
    const productsQuantities = [];
    const productsCategories = [];
    products.map((product) => {
        const { price, inventory, category } = product;
        const productValue = price * inventory;
        return (productsValues.push(productValue),
            productsQuantities.push(inventory),
            productsCategories.push(category));
    });
    let storeValue = productsValues.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0);
    // storeValue = Number(storeValue.toFixed(4))
    const uniqueCategoriesCount = [...new Set(productsCategories)].length;
    const outOfStockCount = products.filter((product) => product.inventory < 1).length;
    res.status(200).json({
        storeValue,
        outOfStock: outOfStockCount,
        categoriesCount: uniqueCategoriesCount,
    });
});
exports.getProductsStats = getProductsStats;
module.exports = {
    createProduct: exports.createProduct,
    getAllProducts: exports.getAllProducts,
    getSingleProduct: exports.getSingleProduct,
    updateProduct: exports.updateProduct,
    deleteProduct: exports.deleteProduct,
    uploadImages: exports.uploadImages,
    getPaginatedProducts: exports.getPaginatedProducts,
    getProductsStats: exports.getProductsStats,
};
