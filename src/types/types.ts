import { Request } from "express-serve-static-core";
import mongoose from "mongoose";

export interface TokenUser {
  name?: string;
  //   userId: mongoose.Types.ObjectId;
  userId: string;
  role: "admin" | "user";
}

export interface ExtendedRequest extends Request {
  user: TokenUser;
}

export interface CustomError extends Error {
  statusCode: number;
  message: string;
  errors: Error[];
  code: number;
  keyValue: string;
  value: string;
}

export interface ImageFile extends File {
  mimetype: string;
  tempFilePath: string;
  size: number;
}
