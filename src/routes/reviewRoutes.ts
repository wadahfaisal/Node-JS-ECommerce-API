import { authenticateUser } from "../middleware/authentication";
import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
const router = Router();

router.route("/").post(authenticateUser, createReview).get(getAllReviews);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
