import express from "express";
import { privateAuthenticationRouter, publicAuthenticationRouter } from "./Authentication";
import { privateUserRouter, publicUserRouter } from "./User";
import { publicAdminRouter, privateAdminRouter } from "./Admin";
import { publicProductRouter, privateProductRouter } from "./Product";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([publicUserRouter, publicAuthenticationRouter, publicProductRouter, publicAdminRouter]);
privateRouter.use([privateUserRouter, privateAuthenticationRouter, privateProductRouter, privateAdminRouter]);


export { publicRouter, privateRouter }