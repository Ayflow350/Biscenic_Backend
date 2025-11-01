// src/models/user.model.ts

import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDoc } from "../interfaces/user.interface";
import { UserRole } from "../types/user.types";

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // Validates that the role is either 'customer' or 'admin'
      default: UserRole.CUSTOMER,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Mongoose "pre-save hook": This function runs automatically before a new user document is saved.
userSchema.pre<IUserDoc>("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Instance method to compare a given password with the database hash
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUserDoc>("User", userSchema);

export default User;
