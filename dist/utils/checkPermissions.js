"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const errors_1 = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);
    if (requestUser.role === "admin")
        return;
    if (requestUser.userId === resourceUserId.toString())
        return;
    throw new errors_1.UnauthorizedError("Not authorized to access this route");
};
exports.checkPermissions = checkPermissions;
// export chechPermissions;
