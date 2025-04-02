import { ImageFile, TokenUser } from "./src/types/types";

declare global {
  namespace Express {
    // export interface Request {
    interface Request {
      query: {
        search: string;
        name: string;
        page?: number;
        limit?: number;
      };
      user?: TokenUser;
      files?: {
        images?: ImageFile[] | ImageFile;
      };
    }
  }
}
