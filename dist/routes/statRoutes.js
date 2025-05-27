"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController");
const authentication_1 = require("../middleware/authentication");
const router = (0, express_1.Router)();
router.get("/categories", [authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], statsController_1.getCategoryStats);
router.get("/companies", [authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin")], statsController_1.getCompanyStats);
exports.default = router;
