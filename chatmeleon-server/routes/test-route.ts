import testConnectWithDatabase from "../controllers/test-controller.js"
import { Router } from 'express';
import { Request, Response } from "express";
// Define your async route handler function
const testRouteHandler = async (req: Request, res: Response) => {
    try {
      const TEST = await testConnectWithDatabase();
      res.send(JSON.stringify(TEST));
    } catch (error) {
      console.error(error);
      res.send("VCL");
    }
  };

export const defaultRoute = Router();

defaultRoute.get('/test', testRouteHandler);