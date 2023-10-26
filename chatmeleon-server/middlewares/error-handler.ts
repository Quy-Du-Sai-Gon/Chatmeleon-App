import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error for debugging purposes.

  // Check if the error has a 'code' property, which indicates a Prisma error.
  if (err.code) {
    switch (err.code) {
      case "P2002":
        // P2002 represents a unique constraint violation in the database, such as trying to insert a duplicate record.
        // Respond with a 400 Bad Request status and include the specific error message for the client.
        res.status(400).json({ error: `${err.meta.message}` });
        break;
      case "P2014":
        // P2014 indicates a foreign key constraint violation, typically when trying to reference a non-existent record.
        // Respond with a 400 Bad Request status and provide the error message to the client.
        res.status(400).json({ error: `${err.meta.message}` });
        break;
      case "P2003":
        // P2003 is another type of unique constraint violation, often used for more general uniqueness checks.
        // Respond with a 400 Bad Request status and include the error message in the response.
        res.status(400).json({ error: `${err.meta.message}` });
        break;
      case "P2023":
        // P2023 represents an attempt to perform an operation that violates database constraints.
        // Respond with a 400 Bad Request status and include the relevant error message in the response.
        res.status(400).json({ error: `${err.meta.message}` });
        break;
      default:
        // If the Prisma error code is not recognized, it could be an unexpected Prisma error.
        // Respond with a 500 Internal Server Error and include a general error message.
        res.status(500).json({ error: `Something went wrong: ${err.message}` });
        break;
    }
  } else if (err instanceof Error) {
    res.status(500).json({ error: `Network error: ${err.message}` });
  } else {
    // Handle any other unknown errors
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default errorMiddleware;
