import express, { Request, Response } from "express";
import { MakeErrorHandler, adminOnly } from "../../Util/middlewares";
import AdminController from "./admin.controller";
import { IAdmin } from "../../Schema/Admin/admin.type";


const publicAdminRouter = express.Router();
const privateAdminRouter = express.Router();

privateAdminRouter.post("/", adminOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IAdmin = req['admin'];
        res.json(await AdminController.signUp(req.body, _user));
    }
));

privateAdminRouter.get("/", adminOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IAdmin = req['admin'];
        res.json(await AdminController.getById(_user));
    }
));

privateAdminRouter.patch("/update", adminOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IAdmin = req['admin'];
        res.json(await AdminController.update(req.body, _user.id));
    }
));


publicAdminRouter.use("/user", publicAdminRouter);
privateAdminRouter.use("/user", privateAdminRouter);


export { publicAdminRouter, privateAdminRouter } 