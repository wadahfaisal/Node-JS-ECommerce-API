// import { NextFunction, Request, Response } from "express-serve-static-core";
import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { isTokenValid } from "../utils";
import { TokenUser } from "../types/types";
declare global {
  namespace Express {
    interface Request {
      user?: TokenUser;
    }
  }
}
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, role } = isTokenValid({ token });

    // (req as Request & { user: TokenUser }).user = {
    //   name,
    //   userId,
    //   role,
    // } as TokenUser;
    req.user = {
      name,
      userId,
      role,
    } as TokenUser;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

// export const authorizePermissions = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (req?.user && !roles.includes(req.user.role)) {
//       throw new UnauthorizedError("Unauthorized to access this route");
//     }
//     next();
//   };
// };
export const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req?.user && !roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
