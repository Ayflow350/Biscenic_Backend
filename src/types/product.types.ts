import { AvailabilityStatus } from "../models/product";

export interface MaterialOptionInput {
  name: string;
  price: number;
  status?: AvailabilityStatus;
}

export interface FinishOptionInput {
  colorName: string;
  hexCode?: string;
  texture?: string;
  status?: AvailabilityStatus;
}

export interface RatingInput {
  average?: number;
  totalReviews?: number;
}

export interface AIRecommendationInput {
  insights?: string;
  tags?: string[];
}

export interface ProductInput {
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
  materialOptions: MaterialOptionInput[];
  finishOptions: FinishOptionInput[];
  collectionId: string;
  images: string[];
  discount?: number;
  ratings?: RatingInput;
  aiRecommendations?: AIRecommendationInput;
}
