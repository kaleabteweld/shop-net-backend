import mongoose from "mongoose";
import { ECondition, EDeliveryMethod, IProduct, IProductMethods, IProductModel } from "./product.type";
import ImageSchema from "./Image/image.schema";
import { mongooseErrorPlugin } from "../Middleware/errors.middleware";
import { getById, removeByID, update, validator } from "./product.extended";


const ProductSchema = new mongoose.Schema<IProduct, IProductModel, IProductMethods>({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    amount: { type: Number, default: 0, min: 0 },
    brand: { type: String },
    itemModel: { type: String },

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
    categorys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    types: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    for: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]

}, {
    timestamps: true,
    statics: {
        validator,
        getById,
        removeByID,
        update
    }
});

ProductSchema.plugin<any>(mongooseErrorPlugin)

const ProductModel = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);
export default ProductModel;
