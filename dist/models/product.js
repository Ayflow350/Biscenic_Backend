import { Schema, model } from "mongoose";
export var AvailabilityStatus;
(function (AvailabilityStatus) {
    AvailabilityStatus["AVAILABLE"] = "AVAILABLE";
    AvailabilityStatus["COMING_SOON"] = "COMING_SOON";
    AvailabilityStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    AvailabilityStatus["DISCONTINUED"] = "DISCONTINUED";
})(AvailabilityStatus || (AvailabilityStatus = {}));
const MaterialOptionSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(AvailabilityStatus),
        default: AvailabilityStatus.AVAILABLE,
    },
});
const FinishOptionSchema = new Schema({
    colorName: { type: String, required: true },
    hexCode: String,
    texture: String,
    status: {
        type: String,
        enum: Object.values(AvailabilityStatus),
        default: AvailabilityStatus.AVAILABLE,
    },
});
const RatingSchema = new Schema({
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
});
const AIRecommendationSchema = new Schema({
    insights: { type: String },
    tags: [{ type: String }],
});
const ProductSchema = new Schema({
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
}, { timestamps: true });
export default model("Product", ProductSchema);
//# sourceMappingURL=product.js.map