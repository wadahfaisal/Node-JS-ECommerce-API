import { getSingleProductReviews } from "../controllers/reviewController";
import { RequestHandler, Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getPaginatedProducts,
  getProductsStats,
} from "../controllers/productController";

const router = Router();
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

export default router;
