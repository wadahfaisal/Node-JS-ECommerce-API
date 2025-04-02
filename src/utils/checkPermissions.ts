import mongoose from "mongoose";
import { TokenUser } from "../types/types";
import { UnauthorizedError } from "../errors";

export const checkPermissions = (
  requestUser: TokenUser,
  resourceUserId: mongoose.Types.ObjectId
) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new UnauthorizedError("Not authorized to access this route");
};

// export chechPermissions;
