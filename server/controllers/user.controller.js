import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";


// Signup a new user
export const signup = async(req, res) => {
    try {
        const {fullName, email, password, bio} = req.body;
        if(!fullName || !email || !password || !bio){
            return res.status(400).json({
                success: false,
                message: "name, email and password are required!",
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exist, go to login",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({email, fullName, password : hashedPassword, bio});

        const token = generateToken(newUser._id);

        return res.status(200).json({
            success:true,
            userData : newUser,
            token,
            message : "Account created successfully."
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// login a user
export const login = async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "email and password are required!",
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if(!passwordMatched){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            success:true,
            userData : user,
            token,
            message : "Login successful."
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

//controller to check if user is authenticated
export const checkAuth = (req,res) => {
    res.status(200).json({success:true, user : req.user});
}

// controller to update user profile details
export const updateProfile = async(req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio, fullName}, {new: true});
        }

        return res.status(200).json({success:true, user: updatedUser});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}