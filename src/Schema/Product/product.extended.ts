import mongoose from "mongoose";
import Joi from "joi";
import { ValidationErrorFactory } from "../../Types/error"
import { BSONError } from 'bson';
import { MakeValidator } from "../../Util";
import { IProduct, IProductCreateFrom } from "./product.type";


export function validator<T>(userInput: T, schema: Joi.ObjectSchema<T>) {
    return MakeValidator<T>(schema, userInput);
}

export async function getById(this: mongoose.Model<IProduct>, _id: string): Promise<IProduct> {
    try {
        const user = await this.findById(new mongoose.Types.ObjectId(_id));
        if (user == null) {
            throw ValidationErrorFactory({
                msg: "Product not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
        return user;
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }

}

export async function removeByID(this: mongoose.Model<IProduct>, _id: string): Promise<void> {
    try {
        const result = await this.deleteOne({ _id: new mongoose.Types.ObjectId(_id) })
        if (result.deletedCount === 0) {
            throw ValidationErrorFactory({
                msg: "Product not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }
}

export async function update(this: mongoose.Model<IProduct>, _id: string, newProduct: IProductCreateFrom, populatePath?: string | string[]): Promise<IProduct | null> {

    try {
        const result = await this.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, newProduct);
        if (result == null) {
            throw ValidationErrorFactory({
                msg: "Product not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
        if (populatePath) result.populate(populatePath);
        return result
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }
}
