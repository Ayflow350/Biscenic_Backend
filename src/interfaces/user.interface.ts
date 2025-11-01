// src/interfaces/user.interface.ts

import { Document } from "mongoose";
import { UserRole } from "../types/user.types";

/**
 * Interface representing the basic properties required to create a new user.
 * This is typically used for request bodies (e.g., in a sign-up form).
 */
export interface IUser {
  email: string;
  name: string;
  password: string; // The plain-text password before it's hashed.
  role?: UserRole; // Role is optional; it will default to 'customer' in the model.
}

/**
 * Interface representing a User document as it exists in the MongoDB database.
 * It extends the base IUser interface and the Mongoose `Document` type,
 * and includes the custom `comparePassword` method.
 */
export interface IUserDoc extends IUser, Document {
  // Custom method to securely compare a candidate password with the stored hash.
  comparePassword(password: string): Promise<boolean>;
}
