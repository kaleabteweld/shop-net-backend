import mongoose, { Schema } from "mongoose";
import { mongooseErrorPlugin } from "../../Middleware/errors.middleware";
import { ICategory, ICategoryMethods, ICategoryModel } from "./category.type";
import { seed } from "./category.extended";


const categorySchema = new Schema<ICategory, ICategoryModel, ICategoryMethods>({
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    children: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
}, {
    timestamps: true,
    statics: {
        seed
    }
});


categorySchema.plugin<any>(mongooseErrorPlugin)

const CategoryModel = mongoose.model<ICategory, ICategoryModel>('Category', categorySchema);
export default CategoryModel;

