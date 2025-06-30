import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";


const maxAge = 3 * 24 * 60 * 60;
const createToken = (email,userId) => {
    return jwt.sign({email,userId}, process.env.JWT_KEY,{expiresIn:maxAge});
}

export const signup = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send("All fields are required");
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).send("User already exists");
        }

        const user = new User({
            email,
            password,
        });

        await user.save();

        return res.cookie("jwt",createToken(email,user.id),{maxAge,secure:false}).status(201).json({user:{
            id:user.id,
            email:user.email,
            profileSetup:user.profileSetup
        }})
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");

    }
}


export const login = async(req, res, next) => {
     try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send("All fields are required");
        }
        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(404).send("User doesnot exists");
        }

        const authPassword = await compare(password, existingUser.password);

        if(!authPassword){
            return res.status(400).send("Invalid password");
        }

        return res.cookie("jwt",createToken(email,existingUser.id),{maxAge,secure:false}).status(200).json({user:{
            id:existingUser.id,
            email:existingUser.email,
            profileSetup:existingUser.profileSetup,
            firstName:existingUser.firstName,
            lastName:existingUser.lastName,
            image:existingUser.image,
            color:existingUser.color
        }});
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");

    }
}

export const getUserInfo = async(req, res, next) => {
    try{
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).send("User with the given id not found");
        }
        return res.status(200).json({
            
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
        })



    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}



export const updateProfile = async(req, res, next) => {
    try{
        const {userId} = req;
        const {firstName,lastName, color} = req.body;
        console.log(firstName, lastName, color);
        if(!firstName || !lastName ){
            return res.status(400).send("All fields are required");
        }
        

        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup :true
        },{new:true, runValidators:true});
        return res.status(200).json({
            
                id:userData.id,
                email:userData.email,
                profileSetup:userData.profileSetup,
                firstName:userData.firstName,
                lastName:userData.lastName,
                image:userData.image,
                color:userData.color
            
        })



    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}




export const addProfileImage = async(req,res) => {
    try{
        if(!req.file){
            return res.status(400).send("File is required");
        }
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            image:fileName
        },{new:true, runValidators:true});

        return res.status(200).json({
            image:updatedUser.image
        });
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}



export const removeProfileImage = async(req,res) => {
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send("User with the given id not found");
        }   

        if(user.image){
            unlinkSync(user.image);
        }
        
        user.image = null;
        await user.save();
        return res.status(200).send("Profile image removed successfully");

    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}


export const logout = async(req, res, next) => {
    try{
        res.clearCookie("jwt");
        return res.status(200).send("Logged out successfully");
    }
    catch(error){
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}
