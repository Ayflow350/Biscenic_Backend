import * as userService from "../services/user.service";
export const getUserHandler = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const user = await userService.findUserById(id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAllUsersHandler = async (req, res) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * Get the currently signed-in user's profile (based on token)
 */
export const getCurrentUserHandler = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No user found in token." });
        }
        const user = await userService.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=user.controller.js.map