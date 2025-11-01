import Product from "../models/product";
import { ProductInput } from "../types/product.types";
import { AvailabilityStatus } from "../models/product";

export const createProduct = async (data: ProductInput) => {
  // ✅ Ensure availabilityStatus always has a valid value
  const productData = {
    ...data,
    availabilityStatus:
      data.availabilityStatus ?? AvailabilityStatus.COMING_SOON,
  };

  return await Product.create(productData);
};

export const getAllProducts = async () => {
  return await Product.find().populate("collectionId");
};

export const getProductById = async (id: string) => {
  return await Product.findById(id).populate("collectionId");
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductInput>
) => {
  // ✅ Also normalize here for partial updates
  const productData = {
    ...data,
    availabilityStatus:
      data.availabilityStatus ?? AvailabilityStatus.COMING_SOON,
  };

  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
