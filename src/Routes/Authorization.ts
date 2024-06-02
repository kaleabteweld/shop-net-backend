import express from "express";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([]);
privateRouter.use([]);


export { publicRouter, privateRouter }