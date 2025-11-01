import jwt from "jsonwebtoken";
import * as userService from "../services/user.service";
import config from "../config";
export const signUpHandler = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const signInHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findUserByEmail(email);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user.toObject();
        res
            .status(200)
            .json({ message: "Login successful", token, user: userWithoutPassword });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
//# sourceMappingURL=auth.controller.js.map