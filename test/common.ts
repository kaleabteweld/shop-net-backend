import { Response } from "supertest";
import { expect } from '@jest/globals';
import { UserType } from "../src/Util/jwt/jwt.types";
import { IUserLogInFrom, IUserSignUpFrom } from "../src/Schema/user/user.type";
import { ECondition, EDeliveryMethod, IProductCreateFrom, TCondition, TDeliveryMethod } from "../src/Schema/Product/product.type";
import { INewImage } from "../src/Schema/Product/Image/image.type";
import { IAdminLogInFrom, IAdminSignUpFrom } from "../src/Schema/Admin/admin.type";


export const sighupUrl = (user: UserType) => `/Api/v1/public/authentication/${user}/signUp`;
export const privateSighupUrl = (user: UserType = UserType.admin) => `/Api/v1/private/authentication/${user}/signUp`;
export const loginUrl = (user: UserType) => `/Api/v1/public/authentication/${user}/login`;
export const refreshTokenUrl = (user: UserType) => `/Api/v1/public/authentication/${user}/refreshToken`;
export const logoutUrl = (user: UserType) => `/Api/v1/private/authentication/${user}/logOut`;

export const userPrivateUrl = (user: UserType) => `/Api/v1/private/${user}/`;
export const userPublicUrl = (user: UserType) => `/Api/v1/public/${user}/`;

export const productPrivateUrl = () => `/Api/v1/private/product/`;
export const productPublicUrl = () => `/Api/v1/public/product/`;



export const newValidUser: IUserSignUpFrom = {
    email: "test@test.com",
    password: "abcd12345",
    first_name: "test",
    last_name: "1",
    phone_number: "+251900000",
};
export const newValidUser2: IUserSignUpFrom = {
    email: "test2@test.com",
    password: "abcd12345",
    first_name: "test2",
    last_name: "2",
    phone_number: "+251900000",
};
export const ValidUser1Login: IUserLogInFrom = {
    email: "test@test.com",
    password: "abcd12345",
};

export const newValidAdmin: IAdminSignUpFrom = {
    email: "test@admin.com",
    password: "abcd12345",
    phone_number: "+251900000",
}

export const validAdmin1Login: IAdminLogInFrom = {
    email: "test@admin.com",
    password: "abcd12345",
}


export class ProductCreateFormBuilder {
    private productCreateForm: IProductCreateFrom;

    constructor() {
        this.productCreateForm = {
            name: "VPS",
            description: "description",
            price: 2000,
            amount: 12,
            brand: "kolo",
            itemModel: "XP500",
            images: [],
            condition: ECondition.new,
            deliveryMethod: EDeliveryMethod.Yes,
            categorys: [],
            types: [],
            for: [],
        };
    }

    setName(name: string): this {
        this.productCreateForm.name = name;
        return this;
    }

    setDescription(description: string): this {
        this.productCreateForm.description = description;
        return this;
    }

    setPrice(price: number): this {
        this.productCreateForm.price = price;
        return this;
    }

    setAmount(amount: number): this {
        this.productCreateForm.amount = amount;
        return this;
    }

    setBrand(brand: string): this {
        this.productCreateForm.brand = brand;
        return this;
    }

    setItemModel(itemModel: string): this {
        this.productCreateForm.itemModel = itemModel;
        return this;
    }

    setImages(images: INewImage[]): this {
        this.productCreateForm.images = images;
        return this;
    }

    setCondition(condition: TCondition): this {
        this.productCreateForm.condition = condition;
        return this;
    }

    setDeliveryMethod(deliveryMethod: TDeliveryMethod): this {
        this.productCreateForm.deliveryMethod = deliveryMethod;
        return this;
    }

    setCategorys(categorys: string[]): this {
        this.productCreateForm.categorys = categorys;
        return this;
    }

    setTypes(types: string[]): this {
        this.productCreateForm.types = types;
        return this;
    }

    setFor(forValues: string[]): this {
        this.productCreateForm.for = forValues;
        return this;
    }

    build(): IProductCreateFrom {
        return this.productCreateForm;
    }
}

export const expectError = async (response: Response, code: number) => {

    if (code == 400) {
        expect(response.status).toBe(code)
        expect(response.body.body).toBeUndefined();
        expect(response.body.error).toMatchObject({ msg: expect.any(String), type: "validation", attr: expect.any(String) });
    } else {
        expect(response.status).toBe(code)
        expect(response.body.body).toBeUndefined();
        expect(response.body.error).toMatchObject({ msg: expect.any(String) });
    }
}