import { ImageFile, TokenUser } from "./src/types/types";

declare global {
  namespace Express {
    // export interface Request {
    interface Request {
      user: TokenUser;
      files?: {
        images?: ImageFile[] | ImageFile;
      };
    }
  }
}
