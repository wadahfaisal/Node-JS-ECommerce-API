import { NextFunction, Request, Response } from "express-serve-static-core";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { isTokenValid } from "../utils/jwt";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  try {
    const payload = isTokenValid(token);

    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
