import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging

  if (err.code) {
    switch (err.code) {
      // Record not found
      case "P2001":
        res.status(404).json({ error: `Not Found: ${err.meta.message}` }); // Respond with 404 Not Found
        break;

      // Unique constraint violation (e.g., duplicate record)
      case "P2002":
        res.status(400).json({ error: `Bad Request: ${err.meta.message}` }); // Respond with 400 Bad Request
        break;

      // Unique constraint violation (more general)
      case "P2003":
        res.status(400).json({ error: `Bad Request: ${err.meta.message}` }); // Respond with 400 Bad Request
        break;

      // Foreign key constraint violation (e.g., referencing non-existent record)
      case "P2014":
        res.status(400).json({ error: `Bad Request: ${err.meta.message}` }); // Respond with 400 Bad Request
        break;

      // Record not found
      case "P2015":
        res.status(404).json({ error: `Not Found: ${err.meta.message}` }); // Respond with 404 Not Found
        break;

      // Inconsistent data column
      case "P2023":
        res.status(400).json({ error: `Bad Request: ${err.meta.message}` }); // Respond with 400 Bad Request
        break;

      // Unique constraint violation (e.g., unauthorized access)
      case "P2025":
        res.status(403).json({ error: `Unauthorized` }); // Respond with 403 Forbidden
        break;

      // Unexpected Prisma error
      default:
        res.status(500).json({ error: `Something went wrong: ${err.message}` }); // Internal server error
        break;
    }
  } else if (err instanceof Error) {
    res.status(500).json({ error: `Network error: ${err.message}` }); // Network error
  } else {
    res.status(500).json({ error: "Something went wrong" }); // Unknown error
  }
};

export default errorMiddleware;
