import { Schema, model, Document } from "mongoose";

export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}

export interface IMaterialOption {
  name: string;
  price: number;
  status: AvailabilityStatus;
}

export interface IFinishOption {
  colorName: string;
  hexCode?: string;
  texture?: string;
  status: AvailabilityStatus;
}

export interface IRating {
  average: number;
  totalReviews: number;
}

export interface IAIRecommendation {
  insights: string;
  tags: string[];
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  pricing: number;
  features: string[];
  specifications: string[];
  luxuryFeatures: string[];
  editions: string[];
  experience: string;
  category: string;
  stockQuantity: number;
  availabilityStatus: AvailabilityStatus;
  materialOptions: IMaterialOption[];
  finishOptions: IFinishOption[];
  collectionId: string;
  images: string[];
  discount?: number;
  ratings?: IRating;
  aiRecommendations?: IAIRecommendation;
  createdAt?: Date;
  updatedAt?: Date;
}

const MaterialOptionSchema = new Schema<IMaterialOption>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(AvailabilityStatus),
    default: AvailabilityStatus.AVAILABLE,
  },
});

const FinishOptionSchema = new Schema<IFinishOption>({
  colorName: { type: String, required: true },
  hexCode: String,
  texture: String,
  status: {
    type: String,
    enum: Object.values(AvailabilityStatus),
    default: AvailabilityStatus.AVAILABLE,
  },
});

const RatingSchema = new Schema<IRating>({
  average: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
});

const AIRecommendationSchema = new Schema<IAIRecommendation>({
  insights: { type: String },
  tags: [{ type: String }],
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    pricing: { type: Number, required: true },
    features: [{ type: String }],
    specifications: [{ type: String }],
    luxuryFeatures: [{ type: String }],
    editions: [{ type: String }],
    experience: String,
    category: String,
    stockQuantity: { type: Number, default: 0 },
    availabilityStatus: {
      type: String,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.COMING_SOON,
    },
    materialOptions: [MaterialOptionSchema],
    finishOptions: [FinishOptionSchema],
    collectionId: { type: String, required: true, ref: "Collection" },
    images: [{ type: String }],
    discount: { type: Number, default: 0 },
    ratings: RatingSchema,
    aiRecommendations: AIRecommendationSchema,
  },
  { timestamps: true }
);

export default model<IProduct>("Product", ProductSchema);
