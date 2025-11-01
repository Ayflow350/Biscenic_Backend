import User from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

export const registerUser = async (userData: IUser) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("A user with this email address already exists.");
  }
  const user = new User(userData);
  await user.save();
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials. Please try again.");
  }
  return user;
};

export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

export const findAllUsers = async () => {
  return await User.find({}).select("-password");
};
