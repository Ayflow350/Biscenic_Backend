import * as productService from "../services/product.service";
import { productSchema } from "../validation/product.validation";
import { AvailabilityStatus } from "../models/product";
// Helper to ensure valid enum value
const normalizeAvailabilityStatus = (status) => {
    if (!status)
        return AvailabilityStatus.COMING_SOON;
    return Object.values(AvailabilityStatus).includes(status)
        ? status
        : AvailabilityStatus.COMING_SOON;
};
export const createProductHandler = async (req, res) => {
    try {
        const validated = productSchema.parse(req.body);
        // ✅ Ensure all required arrays exist & availabilityStatus is valid
        const productData = {
            ...validated,
            availabilityStatus: normalizeAvailabilityStatus(validated.availabilityStatus),
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAllProductsHandler = async (_req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getProductHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateProductHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const validated = productSchema.partial().parse(req.body);
        const updateData = {
            ...validated,
            ...(validated.availabilityStatus && {
                availabilityStatus: normalizeAvailabilityStatus(validated.availabilityStatus),
            }),
            // ✅ Prevent undefined arrays during partial updates
            ...(validated.materialOptions && {
                materialOptions: validated.materialOptions ?? [],
            }),
            ...(validated.finishOptions && {
                finishOptions: validated.finishOptions ?? [],
            }),
        };
        const product = await productService.updateProduct(id, updateData);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const deleteProductHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await productService.deleteProduct(id);
        if (!deleted)
            return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=product.controller.js.map