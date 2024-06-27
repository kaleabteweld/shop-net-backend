import Joi from "joi";
import mongoose from "mongoose";

export enum EStatus {
    active = "active",
    disabled = "disabled",
    blocked = "blocked",
}
export type TStatus = "active" | "disabled" | "blocked";

export interface IAdmin extends mongoose.Document {
    parent?: IAdmin;
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    status: TStatus;
}

export interface IAdminMethods {
    encryptPassword(this: IAdmin, password?: string): Promise<String>
    checkPassword(this: IAdmin, password: string): Promise<boolean>
    // checkStatusForAccess(this: IAdmin): Promise<IAdmin | null>
}

export interface IAdminDocument extends IAdmin, IAdminMethods, mongoose.Document {
    checkStatusForAccess: () => mongoose.Query<any, mongoose.Document<IAdmin>>;

}

export interface IAdminModel extends mongoose.Model<IAdminDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
    getByEmail(email: string): Promise<IAdminDocument>
    getById(_id: string): Promise<IAdminDocument>
    setStatus(_id: string, status: TStatus): Promise<IAdminDocument | null>
    update(_id: string, newUser: IAdminUpdateFrom, populatePath?: string | string[]): Promise<IAdminDocument | null>
    removeByID(_id: string): Promise<void>
}

export interface IAdminLogInFrom {
    email: string;
    password: string;
}

export interface IAdminSignUpFrom {
    email: string;
    password: string;
    phone_number: string;
}

export interface IAdminUpdateFrom extends Partial<IAdminSignUpFrom> {
    status: TStatus;
}


