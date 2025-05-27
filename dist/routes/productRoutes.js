"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviewController_1 = require("../controllers/reviewController");
const express_1 = require("express");
const authentication_1 = require("../middleware/authentication");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post([authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.createProduct)
    .get(productController_1.getAllProducts);
router.get("/paginated", [authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.getPaginatedProducts);
router.get("/stats", [authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.getProductsStats);
router
    .route("/uploadImages")
    .post([authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.uploadImages);
router
    .route("/:id")
    .get(productController_1.getSingleProduct)
    .patch([authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.updateProduct)
    .delete([authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], productController_1.deleteProduct);
router.route("/:id/reviews").get(reviewController_1.getSingleProductReviews);
exports.default = router;
