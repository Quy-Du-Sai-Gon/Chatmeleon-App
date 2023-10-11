import testRouteHandler from "../controllers/test-controller.js"
import { Router } from 'express';

export const defaultRoute = Router();

defaultRoute.get('/test', testRouteHandler);