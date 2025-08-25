import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/check").get(protectRoute,checkAuth);
userRouter.route("/update-profile").put(protectRoute, updateProfile);

export default userRouter;