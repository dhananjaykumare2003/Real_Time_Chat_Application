import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.headers.token;

        if(!token){
            return res.status(400).json({
                success : false,
                message : "token is invalid",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);

        if(!user) {
            return res.status(400).json({
                success : false,
                message : "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.json({
            success: false,
            message: error.message
        })
    }
}