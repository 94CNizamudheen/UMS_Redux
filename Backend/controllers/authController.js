
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { jwtSecret,jwtExpiration } from '../config/auth.js';
import {errorResponse,successResponse} from '../utils/response.js'

const genarateToken=(id)=>{
    return jwt.sign({id},jwtSecret,{
        expiresIn:jwtExpiration,
    })
};

const register= async(req,res,next)=>{
    console.log("registration invoked")
    try {
        const {username,email,password}=req.body;
        const userExists= await User.findOne({email});
        if(userExists){
            return errorResponse(res,400,'User already exists');
        }
        const user= await User.create({
            username,email,password
        });
        if(user){
            const token= genarateToken(user._id);
            return successResponse(res,201,{
                user:{
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    role:user.role,
                    profileImage:user.profileImage,
                    createdAt:user.createdAt,
                    updateAt:user.updatedAt
                },
                token
            });
        }else{
            return errorResponse(res,400,'Invalid user data')
        }
        
    } catch (error) {
        next(error)
    }
};
 const login= async(req,res,next)=>{
    console.log("Login invoked")
    try {
        const{email,password}=req.body;
        const user= await User.findOne({email}).select('+password');
        if(!user){
            return errorResponse(res,400,"Invalid Credentials")
        }
        const isMatch= await user.matchPassword(password);
        if(!isMatch){
            return errorResponse(res,401,'Invalid credentials')
        }
        const token= genarateToken(user._id);
        return successResponse(res,200,{
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                profileImage:user.profileImage,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt

            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.user.id);
        if(!user){
            return errorResponse(res, 404, 'User not found');
        }
        return successResponse(res,200,user)
    } catch (error) {
        next(error)
    }
};

const authController={
    register,login,getCurrentUser
};


export {authController}
 
