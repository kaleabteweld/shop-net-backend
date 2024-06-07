import mongoose from "mongoose";
import { ECondition, EDeliveryMethod, IProduct, IProductMethods, IProductModel } from "./product.type";
import ImageSchema from "./Image/image.schema";
import { mongooseErrorPlugin } from "../Middleware/errors.middleware";


const ProductSchema = new mongoose.Schema<IProduct, IProductModel, IProductMethods>({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    amount: { type: Number, default: 0, min: 0 },
    brand: { type: String },
    modelId: { type: String },

    images: [ImageSchema],
    condition: {
        type: String,
        enum: Object.values(ECondition),
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: Object.values(EDeliveryMethod),
        required: true
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, {
    timestamps: true
});

ProductSchema.plugin<any>(mongooseErrorPlugin)

const ProductModel = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);