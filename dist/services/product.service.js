import Product from "../models/product";
import { AvailabilityStatus } from "../models/product";
export const createProduct = async (data) => {
    // ✅ Ensure availabilityStatus always has a valid value
    const productData = {
        ...data,
        availabilityStatus: data.availabilityStatus ?? AvailabilityStatus.COMING_SOON,
    };
    return await Product.create(productData);
};
export const getAllProducts = async () => {
    return await Product.find().populate("collectionId");
};
export const getProductById = async (id) => {
    return await Product.findById(id).populate("collectionId");
};
export const updateProduct = async (id, data) => {
    // ✅ Also normalize here for partial updates
    const productData = {
        ...data,
        availabilityStatus: data.availabilityStatus ?? AvailabilityStatus.COMING_SOON,
    };
    return await Product.findByIdAndUpdate(id, productData, { new: true });
};
export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};
//# sourceMappingURL=product.service.js.map