import express, { Request, Response } from "express";
import { MakeErrorHandler } from "../../Util/middlewares";
import { UserController } from "../User";
import { UserType } from "../../Util/jwt/jwt.types";
import { makeAuthHeaders } from "../../Util/jwt";

const publicAuthenticationRouter = express.Router();
const privateAuthenticationRouter = express.Router();

function ClassMap(userType: string): UserController {
    const classmap = new Map<string, any>();
    classmap.set(UserType.user, UserController);
    // classmap.set(UserType.organizer, OrganizerController);
    return classmap.get(userType);
}

publicAuthenticationRouter.post('/:userType/signUp', MakeErrorHandler(
    async (req: Request, res: Response) => {

        const controller: any = ClassMap(req.params.userType);
        const user = await controller.signUp(req.body);

        makeAuthHeaders(res, user.header)
        res.json(user.body);
    }
));

publicAuthenticationRouter.post('/:userType/logIn', MakeErrorHandler(
    async (req: Request, res: Response) => {

        // const controller: any = getControllerFactory(req.params.userType);
        const controller: any = ClassMap(req.params.userType);
        console.log({ userType: req.params.userType, controller })
        const user = await controller.logIn(req.body);

        makeAuthHeaders(res, user.header)
        res.json(user.body)
    }
));

publicAuthenticationRouter.get('/:userType/refreshToken', MakeErrorHandler(
    async (req: Request, res: Response) => {

        const controller: any = ClassMap(req.params.userType);
        const token = req.headers.authorization?.split('Bearer ')[1] ?? "";
        const user = await controller.refreshToken(token);

        makeAuthHeaders(res, user.header)
        res.json({})
    }
));

privateAuthenticationRouter.delete('/:userType/logOut', MakeErrorHandler(
    async (req: Request, res: Response) => {

        const token = req.headers.authorization?.split('Bearer ')[1] ?? "";
        // const controller: any = getControllerFactory(req.params.userType);
        const controller: any = ClassMap(req.params.userType);

        const user = await controller.logOut(token);

        res.json({});
    }
));

publicAuthenticationRouter.use("/authentication", publicAuthenticationRouter);
privateAuthenticationRouter.use("/authentication", privateAuthenticationRouter);

export { publicAuthenticationRouter, privateAuthenticationRouter } 