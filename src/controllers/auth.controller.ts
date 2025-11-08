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

    // ✅ Your desired payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Sign JWT with payload
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });

    // Set HTTP-only cookie for secure auto-inclusion
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Send the payload + token in JSON response so frontend can store it
    res.status(200).json({
      message: "Login successful",
      user: payload,
      token,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
