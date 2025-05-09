
import User from '../models/user.js';
import {errorResponse,successResponse} from '../utils/response.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename=fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);


const getUsers=async(req,res,next)=>{
    try {
        const users= await User.find().select('-__v');
        return successResponse(res,200,users);
    } catch (error) {
        next(error);
    }
}

const getUserById=async()=>{
    try {
        const user= await User.findById(req.params.id).select('-__v');
        if(!user){
            return errorResponse(res,404, "User Not found");
        }
        return successResponse(res,200,user);
    } catch (error) {
        next(error)
    }
};

const createUser=async(req,res,next)=>{
    try {
        const {email,username,password,role}=req.body;
        const userExists= await User.findOne({email});
        if(userExists){
            return errorResponse(req,404,"User already Exists");
        }
        const user= await User.create({
            username,
            email,
            password,
            role,
        })
        if(user){
            return successResponse(res,200,user)
        }else{
            return errorResponse(res,400,"Invalid user Data")
        }

    } catch (error) {
        next(error)
    }
};


const updateUser=async(req,res,next)=>{
    try {
        const userId=req.params.id;
        const user= await User.findById(userId);
        if(!user){
            return errorResponse(res,400,"User not found");
        };
        if(req.user.role!=='admin' && req.user.id!==userId){
            return errorResponse(res,400,'Not authorized to update this user');
        }
        const {username,password,email,role,profileImage}= req.body;
        console.log(profileImage)
        if(username) user.username=username;
        if(email) user.email=email;
        if(password) user.password=password;
        if(role&& req.user.role==='admin') user.role=role;
     
        if(profileImage) user.profileImage=profileImage;

        const updateduser=await user.save()

        return successResponse(res,200,updateduser)

    } catch (error) {
        next(error)
    }
}
const deleteUser= async(req,res,next)=>{
    try {
        const user= await User.findById(req.params.id);
        if(!user){
            return errorResponse(res,404,"User Not Found")
        };
        if(user.profileImage){
            const imagePath= path.join(__dirname,'..',user.profileImage);
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
        }
        await User.findByIdAndDelete(req.params.id);
        return successResponse(res,200,{message:'User removed Successfully'})
    } catch (error) {
        next(error)
    }
};


const userController={
    getUsers,getUserById,createUser,deleteUser,updateUser
}

export {userController}