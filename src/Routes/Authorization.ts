import express from "express";
import { privateAuthenticationRouter, publicAuthenticationRouter } from "./Authentication";
import { privateUserRouter, publicUserRouter } from "./User";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([publicUserRouter, publicAuthenticationRouter]);
privateRouter.use([privateUserRouter, privateAuthenticationRouter]);


export { publicRouter, privateRouter }