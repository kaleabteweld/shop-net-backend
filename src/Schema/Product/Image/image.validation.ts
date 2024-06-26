import Joi from "joi";
import { INewImage } from "./image.type";


export const newImageSchema = Joi.object<INewImage>({
    filename: Joi.string().required(),
    data: Joi.binary().required()
});




