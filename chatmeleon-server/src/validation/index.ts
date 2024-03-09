import { z } from "zod";

export const ObjectIdString = z
  .string()
  .regex(/^[0-9a-f]{24}$/i, "Invalid ObjectId string");

export const OptionalObjectIdString = ObjectIdString.optional();
