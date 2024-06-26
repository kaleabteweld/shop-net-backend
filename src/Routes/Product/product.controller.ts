import ProductModel from "../../Schema/Product/product.schema";
import { IProduct, IProductCreateFrom, IProductUpdateFrom } from "../../Schema/Product/product.type";
import { productCreateFromSchema } from "../../Schema/Product/product.validation";
import UserModel from "../../Schema/user/user.schema";
import { IUser } from "../../Schema/user/user.type";
import { IResponseType } from "../../Types";


export default class ProductController {

    static async create(_Product: IProductCreateFrom, _user: IUser): Promise<IResponseType<IProduct>> {

        const user = await UserModel.getUserById(_user.id);
        await ProductModel.validator(_Product, productCreateFromSchema)
        const Product = await new ProductModel({
            ..._Product,
            seller: user.id
        });
        await Product.save();

        return { body: Product.toJSON() }
    }

    // static async update(_Product: IProductUpdateFrom, ProductId: string): Promise<IResponseType<IProduct | null>> {

    //     await ProductModel.validator(_Product, ProductUpdateSchema)
    //     const Product = await ProductModel.getProductById(ProductId);
    //     const updateProduct = await ProductModel.update(Product.id, _Product)
    //     return { body: (updateProduct as any).toJSON() }
    // }

    static async getById(productId: string): Promise<IResponseType<IProduct | null>> {
        return { body: ((await ProductModel.getById(productId))?.toJSON() as any) };
    }

    static async removeById(productId: string): Promise<IResponseType<{} | null>> {
        await ProductModel.removeByID(productId)
        return { body: {} };

    }
}
