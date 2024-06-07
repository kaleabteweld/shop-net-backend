import Joi from "joi";
import mongoose from "mongoose";

export enum EStatus {
    active = "active",
    disabled = "disabled",
    blocked = "blocked",
}

export type TStatus = "active" | "disabled" | "blocked";

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone_number: string;
    status: TStatus;
    postedProducts: mongoose.Schema.Types.ObjectId[];
    viewedProducts: mongoose.Schema.Types.ObjectId[];
    chats: mongoose.Schema.Types.ObjectId[];
    notifications: mongoose.Schema.Types.ObjectId;
    transactions: mongoose.Schema.Types.ObjectId[];
}

export interface IUserMethods {
    encryptPassword(this: IUser, password?: string): Promise<String>
    checkPassword(this: IUser, password: string): Promise<boolean>
}

export interface IUserDocument extends IUser, IUserMethods, mongoose.Document { }

export interface IUserModel extends mongoose.Model<IUserDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
    getUserByEmail(email: string): Promise<IUserDocument>
    getUserById(_id: string): Promise<IUserDocument>
    setStatus(_id: string, status: TStatus): Promise<IUserDocument | null>
    update(_id: string, newUser: IUserUpdateFrom, populatePath?: string | string[]): Promise<IUserDocument | null>
    removeByID(_id: string): Promise<void>
}

export interface IUserLogInFrom {
    email: string;
    password: string;
}

export interface IUserSignUpFrom {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface IUserUpdateFrom extends Partial<IUserSignUpFrom> {
}


