import { connectDB, dropCollections, dropDB } from "./util";
import request from "supertest";
import { describe, expect, beforeEach, afterEach, beforeAll, afterAll, it } from '@jest/globals';
import { loginUrl, logoutUrl, refreshTokenUrl, sighupUrl, newValidUser, ValidUser1Login } from "./common";
import { makeServer } from "../src/Util/Factories";
import RedisCache from "../src/Util/cache/redis";
import { UserType } from "../src/Util/jwt/jwt.types";
import { verifyAccessToken, verifyRefreshToken } from "../src/Util/jwt";
import { IUser } from "../src/Schema/user/user.type";

const app = makeServer();
const redisCache = RedisCache.getInstance();

const newValidUserWithOutPassword = { ...newValidUser }
delete ((newValidUserWithOutPassword as any).password);

describe('User', () => {

    beforeAll(() => {
        return Promise.all([connectDB(), redisCache.connect()]);
    });

    afterAll(() => {
        return Promise.all([dropDB(), redisCache.disconnect()]);
    });

    afterEach(async () => {
        return await dropCollections();
    });

});