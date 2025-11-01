// src/middleware/auth.middleware.ts
import jwt from "jsonwebtoken";
import config from "../config"; // Imports your centralized, type-safe config
/**
 * Middleware to verify the JSON Web Token (JWT) from the Authorization header.
 * If the token is valid, it decodes the payload and attaches it to `req.user`.
 */
export const authenticate = (req, res, next) => {
    // Get the token from the Authorization header, which should be in the format "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authentication failed: No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token using the secret key from your config.
        // The `as` keyword casts the decoded payload to the shape we expect.
        if (!token) {
            return res
                .status(401)
                .json({ message: "Authentication failed: No token provided." });
        }
        const decodedPayload = jwt.verify(token, config.jwtSecret);
        // Attach the payload to the request object for use in subsequent middleware or controllers.
        req.user = decodedPayload;
        // Pass control to the next middleware in the chain.
        next();
    }
    catch (error) {
        // If jwt.verify fails, it throws an error (e.g., for an expired or malformed token).
        res.status(400).json({ message: "Authentication failed: Invalid token." });
    }
};
/**
 * Middleware factory that returns a middleware function to authorize users based on their roles.
 * This is used for Role-Based Access Control (RBAC).
 * @param requiredRoles - An array of UserRole enums that are permitted to access the resource.
 */
export const authorize = (requiredRoles) => {
    return (req, res, next) => {
        // This middleware must run *after* the `authenticate` middleware,
        // so `req.user` will be populated.
        if (!req.user) {
            return res.status(401).json({ message: "Authentication error." });
        }
        // Check if the user's role is included in the list of required roles.
        if (!requiredRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: You do not have the required permissions.",
            });
        }
        // If the user has the required role, pass control to the next middleware.
        next();
    };
};
//# sourceMappingURL=auth.middleware.js.map