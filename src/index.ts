// src/index.ts

// --- Core Node.js and Express Imports ---
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import morgan from "morgan"; // Moved morgan import to the top for consistency
import cookieParser from "cookie-parser"; // Import cookie-parser

// --- Custom Internal Imports ---
import connectDB from "./config/db.config.js";
import errorHandler from "./config/middleware/error.middleware.js";

// --- Route Imports ---
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.routes.js";
import collectionRoutes from "./routes/collection.routes.js";

// --- Initializations ---
dotenv.config();
connectDB();
const app = express();

// --- Middleware Configuration ---
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-production-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser()); // Use cookie-parser for handling JWTs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Morgan Request Logger Configuration ---
morgan.token("body", (req: Request) => {
  // We only want to log the body for requests that have one
  if (!["POST", "PUT", "PATCH"].includes(req.method ?? "")) {
    // <-- THIS IS THE FIX
    return "";
  }
  return JSON.stringify(req.body);
});

// Use Morgan after body-parser middleware to ensure `req.body` is available
app.use(morgan(":method :url :status :response-time ms - :body"));

// --- Health Check Route ---
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "🚀 Biscenic API Server is running successfully!",
    status: "healthy",
  });
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/collections", collectionRoutes);

// --- Error Handling ---
// This should be the last middleware in the chain
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, () => {
  console.log(
    colors.yellow.bold(
      `✅ Server is running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    )
  );
});

// --- Graceful Shutdown ---
process.on("unhandledRejection", (err: any) => {
  console.error(
    colors.red.bold(`❌ Unhandled Rejection Error: ${err.message}`)
  );
  server.close(() => process.exit(1));
});
