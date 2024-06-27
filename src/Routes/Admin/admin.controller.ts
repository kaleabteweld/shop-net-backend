import { IAdmin, IAdminLogInFrom, IAdminSignUpFrom, IAdminUpdateFrom } from "../../Schema/Admin/admin.type";
import AdminModel from "../../Schema/Admin/admin.schema";
import { IResponseType, IResponseWithHeaderType } from "../../Types";
import { MakeTokens, removeRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../Util/jwt";
import { UserType } from "../../Util/jwt/jwt.types";
import { adminLogInSchema, adminSignUpSchema, adminUpdateSchema } from "../../Schema/Admin/admin.validation";


export default class AdminController {

    static async signUp(_user: IAdminSignUpFrom, ParentAdmin: IAdmin): Promise<IResponseWithHeaderType<IAdmin>> {

        await AdminModel.getById(ParentAdmin._id as any);
        await AdminModel.validator(_user, adminSignUpSchema)
        const user = await new AdminModel({ ..._user, parent: ParentAdmin._id });
        await user!.encryptPassword();
        await user.save();
        const { accessToken, refreshToken } = await MakeTokens(user.toJSON(), UserType.user);

        return { body: user.toJSON(), header: { accessToken, refreshToken } }
    }

    static async logIn(from: IAdminLogInFrom): Promise<IResponseWithHeaderType<IAdmin>> {
        await AdminModel.validator(from, adminLogInSchema);
        const user = await AdminModel.getByEmail(from.email);
        await user!.checkPassword(from.password);
        await user!.checkStatusForAccess();

        const { accessToken, refreshToken } = await MakeTokens(user!.toJSON(), UserType.user);
        return { body: user!.toJSON(), header: { accessToken, refreshToken } }

    }

    static async refreshToken(_refreshToken: string): Promise<IResponseWithHeaderType<undefined>> {

        const tokenAdmin = await verifyRefreshToken<IAdmin>(_refreshToken, UserType.user);
        const user = await AdminModel.getById(tokenAdmin!.id);
        await user!.checkStatusForAccess();
        const { accessToken, refreshToken } = await MakeTokens(user!.toJSON(), UserType.user);

        return { body: undefined, header: { accessToken, refreshToken } }
    }

    static async logOut(token: string): Promise<void> {
        const user = await verifyAccessToken<IAdmin>(token, UserType.user);
        await removeRefreshToken(user.id);
    }

    static async update(_user: IAdminUpdateFrom, userId: string): Promise<IResponseType<IAdmin | null>> {


        await AdminModel.validator(_user, adminUpdateSchema)
        const user = await AdminModel.getById(userId);
        await user!.checkStatusForAccess();

        const updateAdmin = await AdminModel.update(user.id, _user)
        return { body: (updateAdmin as any).toJSON() }
    }

    static async getById(user: IAdmin): Promise<IResponseType<IAdmin | null>> {
        return { body: ((await AdminModel.getById(user._id as any ?? ""))?.toJSON() as any) };
    }

    static async removeById(_user: IAdmin): Promise<IResponseType<{} | null>> {
        const user = await AdminModel.getById(_user._id as any);
        await user!.checkStatusForAccess();
        await AdminModel.removeByID(event?.id)

        return { body: {} };

    }

    static async seed(): Promise<void> {
        const bigBoss = new AdminModel({
            email: "kaleabteweld3@gmail.com",
            password: "12345678",
        })
        await bigBoss.encryptPassword();
        await bigBoss.save();
    }
}
