// src/config/db.config.ts

import mongoose from "mongoose";
import colors from "colors";
import config from "./index.js"; // Imports the config we just defined

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(config.mongoURI);

    // Log a success message in a distinct color if the connection is successful
    console.log(
      colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
    );
  } catch (error: any) {
    // Log a critical error message and exit the application if the connection fails
    console.error(
      colors.red.bold(`Error connecting to MongoDB: ${error.message}`)
    );

    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
