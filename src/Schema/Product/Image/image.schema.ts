import { Schema } from "mongoose";
import sharp from 'sharp';
import { IImage, IImageMethods, IImageModel } from "./image.type";


const ImageSchema = new Schema<IImage, IImageModel, IImageMethods>({
    filename: { type: String, required: true },
    data: { type: Buffer, required: true },
    small: { type: Buffer },
    medium: { type: Buffer },
    original: { type: Buffer },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
});


ImageSchema.pre('save', async function (next) {
    const image = this as any;

    if (image.isModified('data')) {
        try {
            image.original = image.data;

            image.small = await sharp(image.data)
                .resize({ width: 200 })
                .toBuffer();

            image.medium = await sharp(image.data)
                .resize({ width: 500 })
                .toBuffer();
        } catch (error: any) {
            return next(error);
        }
    }

    next();
});


export default ImageSchema;

