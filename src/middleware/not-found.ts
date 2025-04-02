import { Request, Response } from "express-serve-static-core";

export const notFound = (req: Request, res: Response) => {
  res.status(404).send("Route does not exist");
};
