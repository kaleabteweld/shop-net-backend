import Joi from "joi";
import { IAdminLogInFrom, IAdminSignUpFrom, IAdminUpdateFrom } from "./admin.type";


export const userSignUpSchema = Joi.object<IAdminSignUpFrom>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone_number: Joi.string().required(),
});

export const userLogInSchema = Joi.object<IAdminLogInFrom>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const userUpdateSchema = Joi.object<IAdminUpdateFrom>({
    phone_number: Joi.string().optional(),
    password: Joi.string().min(8).optional(),
    email: Joi.string().email().optional(),
    status: Joi.string().valid("active", "disabled", "blocked").optional(),
});



