import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging

  if (err instanceof ZodError) {
    // validation failed
    return res.sendStatus(400);
  }

  res.sendStatus(500);
};

export default errorMiddleware;
