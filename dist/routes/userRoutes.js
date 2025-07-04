"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authentication_1 = require("../middleware/authentication");
const userController_1 = require("../controllers/userController");
router
    .route("/")
    .get(authentication_1.authenticateUser, (0, authentication_1.authorizePermissions)("admin"), userController_1.getAllUsers);
router.route("/showMe").get(authentication_1.authenticateUser, userController_1.showCurrentUser);
router.route("/updateUser").patch(authentication_1.authenticateUser, userController_1.updateUser);
router.route("/updateUserPassword").patch(authentication_1.authenticateUser, userController_1.updateUserPassword);
router.route("/:id").get(authentication_1.authenticateUser, userController_1.getSingleUser);
exports.default = router;
