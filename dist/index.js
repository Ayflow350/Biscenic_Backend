// src/index.ts
// --- Core Node.js and Express Imports ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
// --- Custom Internal Imports ---
import connectDB from "./config/db.config";
import errorHandler from "./config/middleware/error.middleware";
// --- Route Imports ---
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.routes"; // Uncomment when created
// --- Initializations ---
// Load environment variables from the .env file
dotenv.config();
// Connect to MongoDB
connectDB();
const app = express();
// --- Middleware Configuration ---
// Enable CORS for frontend communication
app.use(cors({
    origin: [
        "http://localhost:3000", // Local frontend
        "https://your-production-frontend.vercel.app", // Deployed frontend
    ],
    credentials: true,
}));
// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// --- Health Check Route ---
app.get("/", (req, res) => {
    res.status(200).json({
        message: "🚀 Biscenic API Server is running successfully!",
        status: "healthy",
    });
});
// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // Uncomment when ready
// --- Error Handling ---
app.use(errorHandler);
// --- Server Startup ---
const PORT = process.env.PORT || 5050;
const server = app.listen(PORT, () => {
    console.log(colors.yellow.bold(`✅ Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`));
});
// --- Graceful Shutdown for Unhandled Promise Rejections ---
process.on("unhandledRejection", (err) => {
    console.error(colors.red.bold(`❌ Unhandled Rejection Error: ${err.message}`));
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map