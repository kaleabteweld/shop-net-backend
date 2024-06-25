import mongoose from "mongoose";
import { IProduct } from "../product.type";

export interface ICategory extends mongoose.Document {
    name: string;
    parent?: mongoose.Schema.Types.ObjectId | ICategory;
    children: mongoose.Schema.Types.ObjectId[] | ICategory[];
}

export interface ICategoryMethods {

}

export interface ICategoryDocument extends ICategory, ICategoryMethods, mongoose.Document { }

export interface ICategoryModel extends mongoose.Model<ICategoryDocument> {
}


