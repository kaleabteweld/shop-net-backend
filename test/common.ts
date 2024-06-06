import { Response } from "supertest";
import { expect } from '@jest/globals';
import { UserType } from "../src/Util/jwt/jwt.types";
import { IUserLogInFrom, IUserSignUpFrom } from "../src/Schema/user/user.type";


export const sighupUrl = (user: UserType) => `/Api/v1/public/authentication/${user}/signUp`;
export const loginUrl = (user: UserType, wallet: boolean = false) => `/Api/v1/public/authentication/${user}/login${wallet ? "/wallet" : ""}`;
export const refreshTokenUrl = (user: UserType) => `/Api/v1/public/authentication/${user}/refreshToken`;
export const logoutUrl = (user: UserType) => `/Api/v1/private/authentication/${user}/logOut`;

export const userPrivateUrl = (user: UserType) => `/Api/v1/private/${user}/`;
export const userPublicUrl = (user: UserType) => `/Api/v1/public/${user}/`;



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


