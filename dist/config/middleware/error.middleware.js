// src/middleware/error.middleware.ts
// This function must have these exact four parameters for Express to recognize it as an error handler.
const errorHandler = (err, req, res, next) => {
    // Determine the status code. If the response status code is 200 (OK),
    // it means the error was not an intended HTTP error, so we default to 500 (Internal Server Error).
    // Otherwise, we use the status code that was already set on the response.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    // Send a JSON response with the error details.
    res.json({
        message: err.message,
        // Only include the stack trace in development mode for security reasons.
        // The stack trace can leak sensitive information about your server structure.
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
export default errorHandler;
//# sourceMappingURL=error.middleware.js.map