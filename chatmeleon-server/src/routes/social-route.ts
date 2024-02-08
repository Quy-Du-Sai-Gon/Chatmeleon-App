import socialController from "../controllers/social-controller";
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";

export const socialRoute = Router();
