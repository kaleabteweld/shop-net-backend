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
}

export interface IUserDocument extends IUser, IUserMethods, mongoose.Document {
    encryptPassword(this: IUser, password?: string): Promise<String>
    checkPassword(this: IUser, password: string): Promise<boolean>

}

export interface UserModel extends mongoose.Model<IUserDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
    getUserByEmail(this: mongoose.Model<IUser>, email: string): Promise<IUser>
    getUserById(this: mongoose.Model<IUser>, _id: string): Promise<IUser>
    setStatus(this: mongoose.Model<IUser>, _id: string, status: TStatus): Promise<IUser | null>
    update(this: mongoose.Model<IUser>, _id: string, newUser: IUserUpdateFrom, populatePath?: string | string[]): Promise<IUser | null>
    removeByID(this: mongoose.Model<IUser>, _id: string): Promise<void>
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
    full_name: string;
    phone_number: string;
}

export interface IUserUpdateFrom extends Partial<IUserSignUpFrom> {
}


