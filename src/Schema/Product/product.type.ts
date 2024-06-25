import Joi from "joi";
import mongoose from "mongoose";
import { IImage } from "./Image/image.type";
import { IUser } from "../user/user.type";
import { ICategory } from "./Category/category.type";

export enum ECondition {
    new = "New",
    usedFair = "Used - Fair",
    usedGood = "Used - Good",
    usedExcellent = "Used - Excellent"
}

export type TCondition = "New" | "Used - Fair" | "Used - Good" | "Used - Excellent";


export enum EDeliveryMethod {
    "Yes, Free Delivery" = "Yes, Free Delivery",
    Yes = "Yes",
    No = "No"
}

export type TDeliveryMethod = "Yes, Free Delivery" | "Yes" | "No";

export enum EFor {
    men = "men",
    women = "women",
    kids = "kids",
}

export type TFor = "men" | "women" | "kids";


export interface IProduct extends mongoose.Document {

    name: string;
    description: string;
    price: number;
    amount: number;
    brand: string;
    itemModel: string;
    images: IImage[];
    condition: TCondition;
    deliveryMethod: TDeliveryMethod;
    seller: mongoose.Types.ObjectId | IUser;
    categorys: mongoose.Types.ObjectId[] | ICategory[];
    types: mongoose.Types.ObjectId[] | ICategory[];
    for: mongoose.Types.ObjectId[] | ICategory[];

}

export interface IProductMethods { }

export interface IProductDocument extends IProduct, IProductMethods, mongoose.Document { }

export interface IProductModel extends mongoose.Model<IProductDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
}

export interface IProductCreateFrom {
    name: string;
    description: string;
    price: number;
    amount: number;
    brand: string;
    itemModel: string;
    images: IImage[];
    condition: TCondition;
    deliveryMethod: TDeliveryMethod;
}

export interface IProductUpdateFrom extends Partial<IProductCreateFrom> {
}
