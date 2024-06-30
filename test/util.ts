import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import dotenv from 'dotenv';
import CategoryModel from "../src/Schema/Product/Category/category.schema";
import { AdminController } from "../src/Routes/Admin";

dotenv.config({ path: `.env.development` });

export var mongo: MongoMemoryServer;

export const connectDB = async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
    await CategoryModel.seed()
    await AdminController.seed()
};

export const dropDB = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

export const dropCollections = async () => {
    if (mongo) {
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.drop();
        }

        await CategoryModel.seed()
        await AdminController.seed()
    }
};

export function getAdjacentKey<T>(selectedOptions: T[], targetKey: T) {
    const index = selectedOptions.indexOf(targetKey);

    if (index !== -1) {
        // If the targetKey is found in the array
        if (index > 0) {
            // If the targetKey is not the first element, get the previous key
            return selectedOptions[index - 1];
        } else if (index < selectedOptions.length - 1) {
            // If the targetKey is not the last element, get the next key
            return selectedOptions[index + 1];
        }
    }

    return targetKey;
}