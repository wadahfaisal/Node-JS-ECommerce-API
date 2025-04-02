import { Router } from "express";
const router = Router();
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
