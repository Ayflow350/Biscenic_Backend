import { Schema, model, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description: string;
  bannerImage?: string;
  featuredImage?: string;
  highlights?: string[];
  tags?: string[];
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    bannerImage: { type: String },
    featuredImage: { type: String },
    highlights: [{ type: String }],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ICollection>("Collection", CollectionSchema);
