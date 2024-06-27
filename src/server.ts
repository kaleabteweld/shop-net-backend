import mongoose from "mongoose";
import { makeServer } from './Util/Factories';
import dotenv from 'dotenv';
import RedisCache from "./Util/cache/redis";
import CategoryModel from "./Schema/Product/Category/category.schema";
import AdminModel from "./Schema/Admin/admin.schema";
import { AdminController } from "./Routes/Admin";

dotenv.config({ path: `.env.${process.env.NODE_ENV?.trim()}` });
console.log(`[+] running on ${process.env.NODE_ENV?.trim()} mode`)
const app = makeServer();


const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
    console.log(`[+] server started at http://localhost:${port}`);
});

mongoose.connect(process.env.DATABASE_URL ?? "").catch((error) => {
    console.log("[-] Database Connection Error", error);
}).then(() => {
    console.log("[+] Database Connected");
    CategoryModel.seed().catch((error) => {
        console.log("[-] Error Seeding Categories", error);
    }).then(() => {
        console.log("[+] Categories Seeded");
    });
    AdminController.seed().catch((error) => {
        console.log("[-] Error Seeding Admin", error);
    }).then(() => {
        console.log("[+] Admin Seeded");
    });
});

const redisCache = RedisCache.getInstance();
redisCache.connect().catch((error) => {
    console.log("[-] Redis Connection Error", error);
}).then(() => {
    console.log("[+] Redis Connected");
});