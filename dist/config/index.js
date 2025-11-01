// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();
/**
 * A helper function to safely retrieve environment variables.
 * It will throw a hard error and stop the application from starting if a required
 * variable is not defined, preventing runtime errors with 'undefined' values.
 * @param key The name of the environment variable.
 * @returns The value of the environment variable as a string.
 */
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        console.error(`FATAL ERROR: Environment variable "${key}" is not set.`);
        process.exit(1);
    }
    return value;
};
// The main configuration object for the application.
const config = {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || "development",
    // By using the helper function, we guarantee to TypeScript that these values are strings.
    mongoURI: getEnvVar("MONGO_URI"),
    jwtSecret: getEnvVar("JWT_SECRET"),
};
export default config;
//# sourceMappingURL=index.js.map