import mongoose from "mongoose";
import { IProduct } from "../product.type";

export interface IImage extends mongoose.Document {
    filename: string
    data: Buffer
    small: Buffer
    medium: Buffer
    original: Buffer
    product: mongoose.Types.ObjectId | IProduct
}

export interface IImageMethods {
}

export interface IImageDocument extends IImage, IImageMethods, mongoose.Document { }

export interface IImageModel extends mongoose.Model<IImageDocument> {
}



export interface INewImage extends mongoose.Document {
    filename: string
    data: Buffer
}
