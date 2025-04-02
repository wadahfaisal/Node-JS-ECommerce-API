import { Router } from "express";
import {
  getCategoryStats,
  getCompanyStats,
} from "../controllers/statsController";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

const router = Router();

router.get(
  "/categories",
  [authenticateUser, authorizePermissions("admin")],
  getCategoryStats
);
router.get(
  "/companies",
  [authenticateUser, authorizePermissions("admin")],
  getCompanyStats
);

export default router;
