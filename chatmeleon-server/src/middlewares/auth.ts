import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isChatTokenPayload } from "../types/auth";

/**
 * Middleware function to require authentication for a route.
 * It checks if the request has a valid JWT token in the Authorization header.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 * If the token is valid, it decodes the token and attaches the decoded payload to the request object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resUnauthorized = () =>
    res
      .status(401)
      .type("text/plain")
      .send("Unauthorized - JWT token is missing or invalid.");

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return resUnauthorized();
  }

  const chatToken = authHeader.substring("Bearer ".length);

  jwt.verify(chatToken, process.env.CHAT_TOKEN_SECRET!, (err, decoded) => {
    if (err || !isChatTokenPayload(decoded)) {
      return resUnauthorized();
    }

    req.auth = decoded;
    next();
  });
};
