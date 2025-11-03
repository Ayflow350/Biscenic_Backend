import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { productSchema } from "../validation/product.validation";
import { AvailabilityStatus } from "../models/product";

// Helper to ensure valid enum value
const normalizeAvailabilityStatus = (status?: string): AvailabilityStatus => {
  if (!status) return AvailabilityStatus.COMING_SOON;
  return Object.values(AvailabilityStatus).includes(
    status as AvailabilityStatus
  )
    ? (status as AvailabilityStatus)
    : AvailabilityStatus.COMING_SOON;
};

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const validated = productSchema.parse(req.body);

    const productData = {
      ...validated,
      availabilityStatus: normalizeAvailabilityStatus(
        validated.availabilityStatus
      ),
      materialOptions: validated.materialOptions ?? [], // safe default
      finishOptions: validated.finishOptions ?? [], // safe default
      features: validated.features ?? [],
      specifications: validated.specifications ?? [],
      luxuryFeatures: validated.luxuryFeatures ?? [],
      editions: validated.editions ?? [],
      images: validated.images ?? [],
    };

    const product = await productService.createProduct(productData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProductsHandler = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validated = productSchema.partial().parse(req.body);

    const updateData = {
      ...validated,
      ...(validated.availabilityStatus && {
        availabilityStatus: normalizeAvailabilityStatus(
          validated.availabilityStatus
        ),
      }),

      ...(validated.materialOptions && {
        materialOptions: validated.materialOptions ?? [],
      }),
      ...(validated.finishOptions && {
        finishOptions: validated.finishOptions ?? [],
      }),
    };

    const product = await productService.updateProduct(id, updateData);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
