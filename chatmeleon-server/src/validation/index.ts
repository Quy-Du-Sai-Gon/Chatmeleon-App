import { z } from "zod";

export const objectIdString = z
  .string()
  .regex(/^[0-9a-f]{24}$/i, "Invalid ObjectId string");
