const router = require("express").Router();
const {
  getCategoryStats,
  getCompanyStats,
} = require("../controllers/statsController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

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

module.exports = router;
