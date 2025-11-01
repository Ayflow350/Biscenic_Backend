import { z } from "zod";
import { AvailabilityStatus } from "../models/product"; // ✅ import your enum
export const materialOptionSchema = z.object({
    name: z.string().min(2),
    price: z.number().min(0),
    status: z.nativeEnum(AvailabilityStatus).optional(), // ✅ uses enum directly
});
export const finishOptionSchema = z.object({
    colorName: z.string().min(2),
    hexCode: z.string().optional(),
    texture: z.string().optional(),
    status: z.nativeEnum(AvailabilityStatus).optional(), // ✅ same here
});
export const ratingSchema = z.object({
    average: z.number().min(0).max(5).optional(),
    totalReviews: z.number().min(0).optional(),
});
export const aiRecommendationSchema = z.object({
    insights: z.string().optional(),
    tags: z.array(z.string()).optional(),
});
export const productSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string(),
    pricing: z.number().positive(),
    features: z.array(z.string()),
    specifications: z.array(z.string()),
    luxuryFeatures: z.array(z.string()),
    editions: z.array(z.string()),
    experience: z.string(),
    category: z.string(),
    stockQuantity: z.number().min(0),
    // ✅ enum-based validation ensures it matches AvailabilityStatus perfectly
    availabilityStatus: z.nativeEnum(AvailabilityStatus).optional(),
    materialOptions: z.array(materialOptionSchema).optional(),
    finishOptions: z.array(finishOptionSchema).optional(),
    collectionId: z.string().min(2),
    images: z.array(z.string().url()).optional(),
    discount: z.number().min(0).max(100).optional(),
    ratings: ratingSchema.optional(),
    aiRecommendations: aiRecommendationSchema.optional(),
});
//# sourceMappingURL=product.validation.js.map