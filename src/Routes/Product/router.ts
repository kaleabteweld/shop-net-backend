import express, { Request, Response } from "express";
import { MakeErrorHandler, userOnly } from "../../Util/middlewares";
import ProductController from "./product.controller";
import { UserType } from "../../Util/jwt/jwt.types";
import { IUser } from "../../Schema/user/user.type";


const publicProductRouter = express.Router();
const privateProductRouter = express.Router();

privateProductRouter.post("/", userOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IUser = req['user'];
        res.json(await ProductController.create(req.body, _user));
    }
));



publicProductRouter.use("/product", publicProductRouter);
privateProductRouter.use("/product", privateProductRouter);


export { publicProductRouter, privateProductRouter } 