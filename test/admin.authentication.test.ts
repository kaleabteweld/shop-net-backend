import { connectDB, dropCollections, dropDB } from "./util";
import request from "supertest";
import { describe, expect, beforeEach, afterEach, beforeAll, afterAll, it } from '@jest/globals';
import { loginUrl, logoutUrl, newValidAdmin, refreshTokenUrl, privateSighupUrl, validAdmin1Login } from "./common";
import { makeServer } from "../src/Util/Factories";
import RedisCache from "../src/Util/cache/redis";
import { UserType } from "../src/Util/jwt/jwt.types";
import { verifyAccessToken, verifyRefreshToken } from "../src/Util/jwt";
import { IAdmin } from "../src/Schema/Admin/admin.type";
import e from "express";

const app = makeServer();
const redisCache = RedisCache.getInstance();

const newValidAdminWithOutPassword = { ...newValidAdmin }
delete ((newValidAdminWithOutPassword as any).password);


describe('Admin Authentication', () => {

    beforeAll(() => {
        return Promise.all([connectDB(), redisCache.connect()]);
    });

    afterAll(() => {
        return Promise.all([dropDB(), redisCache.disconnect()]);
    });

    afterEach(async () => {
        return await dropCollections();
    });

    describe("SignUp", () => {

        describe("WHEN Admin enters valid inputs THEN Admin sign up ", () => {

            var Admin: IAdmin;
            var adminAccessToken: string;

            beforeEach(async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({
                    email: "kaleabteweld3@gmail.com",
                    password: "12345678"
                });
                Admin = response.body;
                adminAccessToken = response.header.authorization.split(" ")[1];
            })

            it("Should return 200", async () => request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin).expect(200));

            it("Should return Admin object", async () => {
                const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                expect(response.body).toMatchObject({ ...newValidAdminWithOutPassword });
            });

            it("Should have parent admin", async () => {
                const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                expect(response.body.parent).toBe(Admin.id);
            });

            describe("Should be valid Access Token in header WHEN Admin enters valid inputs", () => {

                it("Should be set", async () => {
                    const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                    expect(response.header).toHaveProperty("authorization");

                    const accessToken = response.header.authorization.split(" ")[1];
                    expect(accessToken).toBeTruthy();
                });

                it("Should be valid", async () => {
                    const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                    expect(response.header).toHaveProperty("authorization");

                    const accessToken = response.header.authorization.split(" ")[1];
                    const Admin = await verifyAccessToken(accessToken, UserType.admin);
                    expect(Admin).toBeTruthy();
                    expect(Admin).toMatchObject({ ...newValidAdminWithOutPassword });
                });

            });

            describe("Should be valid Refresh token in header WHEN Admin enters valid inputs", () => {

                it("Should be set", async () => {
                    const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                    expect(response.header).toHaveProperty("refreshtoken");

                    const refreshToken = response.header.refreshtoken.split(" ")[1];
                    expect(refreshToken).toBeTruthy();
                });

                it("Should be set in Cache", async () => {
                    const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                    expect(response.header).toHaveProperty("refreshtoken");

                    const Admin: any = response.body;

                    const refreshToken = response.header.refreshtoken.split(" ")[1];
                    const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);

                    expect(Admin).toBeTruthy();
                    expect(cacheRefreshToken).toBe(refreshToken);
                });

                it("Should be valid", async () => {
                    const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin);
                    expect(response.header).toHaveProperty("refreshtoken");

                    const refreshToken = response.header.refreshtoken.split(" ")[1];
                    const Admin = await verifyRefreshToken(refreshToken, UserType.admin);

                    expect(Admin).toBeTruthy();
                    expect(Admin).toMatchObject({ ...newValidAdminWithOutPassword });
                });

            });
        })

        describe("WHEN Admin try to sign up with out a parent", () => {
            it("should return 401 Unauthorized", async () => request(app).post(privateSighupUrl(UserType.admin)).send({}).expect(401));
        });

        describe("WHEN Admin enters invalid inputs THEN ", () => {

            var Admin: IAdmin;
            var adminAccessToken: string;

            beforeEach(async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({
                    email: "kaleabteweld3@gmail.com",
                    password: "12345678"
                });
                Admin = response.body;
                adminAccessToken = response.header.authorization.split(" ")[1];
            })

            it("should return 400 Bad Request", async () => request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send({}).expect(400));

            it("should return Validation error message", async () => {
                const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send({});
                expect(response.body.error).toBeDefined();

                const error = response.body.error;
                expect(error).toBeTruthy();
                expect(error).toMatchObject({ msg: expect.any(String), type: "validation", attr: expect.any(String) });
            });

            it("should not set Authentication header", async () => {
                const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send({});
                expect(response.header).not.toHaveProperty("authorization");
            });

            it("should not set Refresh token", async () => {
                const response = await request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send({});
                expect(response.header).not.toHaveProperty("refreshtoken");
            });

        });
    })

    describe("Login", () => {

        beforeEach(async () => {
            const response = await request(app).post(loginUrl(UserType.admin)).send({
                email: "kaleabteweld3@gmail.com",
                password: "12345678"
            });
            const adminAccessToken = response.header.authorization.split(" ")[1];
            return request(app).post(privateSighupUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`).send(newValidAdmin)
        });

        describe("WHEN Admin enters valid inputs THEN Admin login ", () => {

            it("Should return 200", async () => request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login).expect(200));

            it("Should return Admin object", async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);

                expect(response.body).toMatchObject({ ...newValidAdminWithOutPassword });
            });

            describe("WHEN Admin enters valid inputs THEN Authentication header is set", () => {

                it("Should be set", async () => {
                    const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);
                    expect(response.header).toHaveProperty("authorization");

                    const accessToken = response.header.authorization.split(" ")[1];
                    expect(accessToken).toBeTruthy();
                });

                it("Should be valid", async () => {
                    const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);
                    expect(response.header).toHaveProperty("authorization");

                    const accessToken = response.header.authorization.split(" ")[1];
                    const Admin = await verifyAccessToken(accessToken, UserType.admin);
                    expect(Admin).toBeTruthy();

                    expect(response.body).toMatchObject({ ...newValidAdminWithOutPassword });
                });

            });

            describe("WHEN Admin enters valid inputs THEN Refresh token is set", () => {

                it("Should be set", async () => {
                    const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);
                    expect(response.header).toHaveProperty("refreshtoken");

                    const refreshToken = response.header.refreshtoken.split(" ")[1];
                    expect(refreshToken).toBeTruthy();
                });

                it("Should be set in Cache", async () => {
                    const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);
                    expect(response.header).toHaveProperty("refreshtoken");

                    const Admin: any = response.body;

                    const refreshToken = response.header.refreshtoken.split(" ")[1];
                    const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);

                    expect(Admin).toBeTruthy();
                    expect(response.body).toMatchObject({ ...newValidAdminWithOutPassword });

                    expect(cacheRefreshToken).toBe(refreshToken);
                });

                it("Should be valid", async () => {
                    const response = await request(app).post(loginUrl(UserType.admin)).send(validAdmin1Login);
                    expect(response.header).toHaveProperty("refreshtoken");
                });
            });
        });

        describe("WHEN Admin enters invalid inputs THEN Admin does't login ", () => {

            it("should return 400 Bad Request", async () => request(app).post(loginUrl(UserType.admin)).send({}).expect(400));

            it("Should return Validation error message", async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({});
                expect(response.body.error).toBeDefined();

                const error = response.body.error;
                expect(error).toBeTruthy();
                expect(error).toMatchObject({ msg: expect.any(String), type: "validation", attr: expect.any(String) });
            });

            it("Should return Invalid Email, Password or is't active error message", async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({ email: "abc1@gmail.com", password: "12345678" });
                expect(response.body.error).toBeDefined();

                const error = response.body.error;
                expect(error).toBeTruthy();
                expect(error).toMatchObject({ msg: "Invalid Email, Password or is't active", type: expect.any(String) });
            });

            it("Should not set Authentication header", async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({});
                expect(response.header).not.toHaveProperty("authorization");
            });

            it("should not set Refresh token", async () => {
                const response = await request(app).post(loginUrl(UserType.admin)).send({});
                expect(response.header).not.toHaveProperty("refreshtoken");
            });

        });
    });

    describe("Refresh Token", () => {

        var Admin: IAdmin;
        var adminAccessToken: string;

        beforeEach(async () => {
            const response = await request(app).post(loginUrl(UserType.admin)).send({
                email: "kaleabteweld3@gmail.com",
                password: "12345678"
            });
            Admin = response.body;
            adminAccessToken = response.header.refreshtoken.split(" ")[1];
        })

        describe("WHEN Admin refresh a valid token THEN Admin gets new accessToken and refreshToken", () => {

            it("Should return 200", async () => {
                const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`)
                expect((response).status).toBe(200);
            });

            it("Should have header AccessToken and Refreshtoken", async () => {

                const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`);
                expect(response.header).toHaveProperty("authorization");
                expect(response.header).toHaveProperty("refreshtoken");
            });

            it("Should have valid header AccessToken and Refreshtoken", async () => {

                const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`)

                expect(response.header).toHaveProperty("authorization");
                expect(response.header).toHaveProperty("refreshtoken");

                const accessToken = response.header.authorization.split(" ")[1];
                const refreshToken = response.header.refreshtoken.split(" ")[1];

                let Admin = await verifyAccessToken(accessToken, UserType.admin);
                expect(Admin).toBeTruthy();
                Admin = await verifyRefreshToken(refreshToken, UserType.admin);
                expect(Admin).toBeTruthy();

                adminAccessToken = refreshToken;

            });


            describe("WHEN Admin refresh a valid token THEN token MUST be set on Cache", () => {

                it("Should exist on Cache ", async () => {
                    const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`);
                    const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);

                    expect(cacheRefreshToken).toBeTruthy();
                    expect(response.header).toHaveProperty("refreshtoken");

                    const newRefreshToken = response.header.refreshtoken.split(" ")[1];

                    expect(cacheRefreshToken).toBe(newRefreshToken);

                    adminAccessToken = newRefreshToken;
                });

                it("Should be in sync with Cache", async () => {
                    //TODO: compare old token with new token

                    const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer ${adminAccessToken}`);
                    const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);
                    const newRefreshToken = response.header.refreshtoken.split(" ")[1];

                    expect(cacheRefreshToken).toBeTruthy();
                    expect(cacheRefreshToken).toBe(newRefreshToken);

                });
            })

        });

        describe("WHEN Admin refresh an invalid token THEN Admin gets 400", () => {

            it("should return 401 Unauthorized", async () => request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', "").expect(400));

            it("Should Not change header AccessToken and Refreshtoken ", async () => {
                const response = await request(app).get(refreshTokenUrl(UserType.admin)).set('authorization', `Bearer `);
                const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);

                expect(cacheRefreshToken).toBeTruthy();
                expect(response.header).not.toHaveProperty("authorization");
            })

        });

    });

    describe("Logout", () => {

        var Admin: IAdmin;
        var AdminAccessToken: string;

        beforeEach(async () => {

            const response = await request(app).post(loginUrl(UserType.admin)).send({
                email: "kaleabteweld3@gmail.com",
                password: "12345678"
            });
            Admin = response.body;
            AdminAccessToken = response.header.authorization.split(" ")[1];
        })

        describe("WHEN a valid Admin logout THEN Admin token is remove", () => {


            it("Should return 200", async () => {
                const response = await request(app).delete(logoutUrl(UserType.admin)).set('authorization', `Bearer ${AdminAccessToken}`)
                expect((response).status).toBe(200);
            });

            it("Should remove Refresh Token token from Cache", async () => {
                const response = await request(app).delete(logoutUrl(UserType.admin)).set('authorization', `Bearer ${AdminAccessToken}`)
                const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);
                expect(cacheRefreshToken).toBeFalsy();
            });

        });

        describe("WHEN an invalid Admin logout THEN Admin token is NOT remove", () => {

            it("should return 401 Unauthorized", async () => request(app).delete(logoutUrl(UserType.admin)).set('authorization', "Bearer ").expect(401));

            it("Should only remove token from Cache if valid", async () => {
                await request(app).delete(logoutUrl(UserType.admin)).set('authorization', `Bearer `)
                const cacheRefreshToken = await redisCache.getRefreshToken(Admin.id);
                expect(cacheRefreshToken).toBeTruthy();
            });

        })

    });

})
