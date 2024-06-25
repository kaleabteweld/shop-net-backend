import mongoose from "mongoose";
import Joi from "joi";
import { MakeValidator } from "../../../Util";
import { ICategory } from "./category.type";
import categories from "./categories.json";
import CategoryModel from "./category.schema";
import fs from 'fs';
import path from 'path';



export function validator<T>(userInput: T, schema: Joi.ObjectSchema<T>) {
    return MakeValidator<T>(schema, userInput);
}

export async function seed(this: mongoose.Model<ICategory>, subList: any = categories): Promise<void> {
    const data = fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf-8');
    const categories = JSON.parse(data);
    try {
        const data = fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf-8');
        const categories = JSON.parse(data);

        const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};

        const processCategory = async (categoryName: string, parentName: string | null) => {
            const category = new CategoryModel({
                name: categoryName,
                parent: parentName ? categoryMap[parentName] : null,
                children: []
            });

            await category.save();
            categoryMap[categoryName] = category._id as any;

            if (parentName) {
                await CategoryModel.findByIdAndUpdate(categoryMap[parentName], {
                    $push: { children: category._id }
                });
            }

            return category;
        };

        const traverseCategories = async (obj: any, parentName: string | null = null) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const category = await processCategory(key, parentName);
                    if (obj[key]?.children) {
                        for (const childKey in obj[key].children) {
                            if (obj[key].children.hasOwnProperty(childKey)) {
                                let subcategory = await processCategory(childKey, key);
                                if (Array.isArray(obj[key].children[childKey])) {
                                    for (const subChild of obj[key].children[childKey]) {
                                        await processCategory(subChild, subcategory.name);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        await traverseCategories(categories);
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
}
