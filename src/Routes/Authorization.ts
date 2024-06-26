import express from "express";
import { privateAuthenticationRouter, publicAuthenticationRouter } from "./Authentication";
import { privateUserRouter, publicUserRouter } from "./User";
import { publicProductRouter, privateProductRouter } from "./Product";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([publicUserRouter, publicAuthenticationRouter, publicProductRouter]);
privateRouter.use([privateUserRouter, privateAuthenticationRouter, privateProductRouter]);


export { publicRouter, privateRouter }