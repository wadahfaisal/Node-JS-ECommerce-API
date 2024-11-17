const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getPaginatedProducts,
  getProductsStats,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createProduct)
  .get(getAllProducts);

router.get(
  "/paginated",
  [authenticateUser, authorizePermissions("admin")],
  getPaginatedProducts
);

router.get(
  "/stats",
  [authenticateUser, authorizePermissions("admin")],
  getProductsStats
);

router
  .route("/uploadImages")
  .post([authenticateUser, authorizePermissions("admin")], uploadImages);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
