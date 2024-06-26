import { connectDB, dropCollections, dropDB } from "./util";
import request from "supertest";
import { describe, expect, beforeEach, afterEach, beforeAll, afterAll, it } from '@jest/globals';
import { makeServer } from "../src/Util/Factories";
import RedisCache from "../src/Util/cache/redis";
import { expectError, newValidUser, productPrivateUrl, sighupUrl } from "./common";
import { IUser } from "../src/Schema/user/user.type";
import { UserType } from "../src/Util/jwt/jwt.types";


const app = makeServer();
const redisCache = RedisCache.getInstance();


describe('Product', () => {

    beforeAll(() => {
        return Promise.all([connectDB(), redisCache.connect()]);
    });

    afterAll(() => {
        return Promise.all([dropDB(), redisCache.disconnect()]);
    });

    afterEach(async () => {
        return await dropCollections();
    });

    describe("Create", () => {

        describe("WHEN not Login in as a User", () => {
            it("SHOULD return a 401 status code AND Error obj", async () => {
                const response = await request(app).post(productPrivateUrl()).send({});
                expectError(response, 401);
            });

            // describe("WHEN Login in as a Admin", () => {

            //     var user: IUser;
            //     var userAccessToken: string;

            //     beforeEach(async () => {
            //         const response = await request(app).post(sighupUrl(UserType.user)).send(newValidUser);
            //         user = response.body;
            //         userAccessToken = response.header.authorization.split(" ")[1];
            //     })

            //     it("SHOULD return a 401 status code AND Error obj", async () => {
            //         const response = await request(app).post(productPrivateUrl()).set('authorization', `Bearer ${userAccessToken}`).send({});
            //         expectError(response, 401);
            //     })
            // })

        });
    })
});