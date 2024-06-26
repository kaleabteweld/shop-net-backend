import Joi from "joi";
import { IProductCreateFrom } from "./product.type";
import { newImageSchema } from "./Image/image.validation";


export const productCreateFromSchema = Joi.object<IProductCreateFrom>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    amount: Joi.number().required(),
    brand: Joi.string().required(),
    itemModel: Joi.string().required(),
    images: newImageSchema.required(),
    condition: Joi.string().valid("new", "used").required(),
    deliveryMethod: Joi.string().valid("Yes, Free Delivery", "Yes", "No").required(),
    categorys: Joi.array().items(Joi.string()).required(),
    types: Joi.array().items(Joi.string()).required(),
    for: Joi.array().items(Joi.string()).required()
});




