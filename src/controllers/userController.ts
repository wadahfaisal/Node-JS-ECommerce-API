import { Request, Response } from "express-serve-static-core";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from "../errors";
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from "../utils";
import { Types } from "mongoose";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user!, user._id as Types.ObjectId);
  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
export const updateUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user!.userId });

  user!.email = email;
  user!.name = name;

  await user!.save();

  const tokenUser = createTokenUser(user!);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user!.userId });

  const isPasswordCorrect = await user!.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  user!.password = newPassword;

  await user!.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

// update user with findOneAndUpdate
// const updateUser = async (req: Request, res: Response) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new BadRequestError('Please provide all values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
