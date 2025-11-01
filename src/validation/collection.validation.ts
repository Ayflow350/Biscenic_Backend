import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().min(2, "Collection name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  bannerImage: z.string().url().optional(),
  featuredImage: z.string().url().optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
});
