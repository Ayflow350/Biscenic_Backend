// In your auth controller file

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service";
import config from "../config";

// --- signUpHandler remains the same, it's already correct ---
export const signUpHandler = async (req: Request, res: Response) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    // It's better to check the error message for specific conflicts
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    res.status(400).json({ message: error.message });
  }
};

// --- signInHandler with the required modifications ---
export const signInHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    // The findUserByEmail service already throws an error if user not found,
    // so this check is redundant, but we can leave it for clarity.
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please try again." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please try again." });
    }

    // --- MODIFICATION STARTS HERE ---

    // 1. Create a cleaner payload for the JWT
    const payload = {
      id: user._id,
      name: user.name, // Add name for easy access on the frontend
      email: user.email,
      role: user.role,
    };

    // 2. Sign the token
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });

    // 3. Set the token in an HTTP-Only cookie instead of the JSON body
    res.cookie("auth-token", token, {
      httpOnly: true, // Crucial for security: prevents JS access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day, matches token expiry
      path: "/",
    });

    // 4. Send the user data (without password) back in the JSON body
    // This allows the frontend to immediately update its state (e.g., AuthContext)
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword, // The user object is still sent
    });

    // --- MODIFICATION ENDS HERE ---
  } catch (error: any) {
    // Your findUserByEmail service throws an error, which will be caught here.
    // The message "Invalid credentials..." is appropriate.
    res.status(401).json({ message: error.message });
  }
};
