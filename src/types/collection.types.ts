export interface CollectionInput {
  name: string;
  slug: string;
  description: string;
  bannerImage?: string;
  featuredImage?: string;
  highlights?: string[];
  tags?: string[];
  isFeatured?: boolean;
}
