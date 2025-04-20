

import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { jwtSecret } from '../config/auth.js';
import { errorResponse } from '../utils/response.js';


const protect=async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token= req.headers.authorization.split(' ')[1];

            const decoded=jwt.verify(token,jwtSecret);
            req.user= await User.findById(decoded.id).select('-password');
            if(!req.user){
                return errorResponse(res, 401, 'Not authorized, user not found');
            }
            next()
        } catch (error) {
            return errorResponse(res, 401, 'Not authorized, token failed');
        }
    }
    if(!token){
        return errorResponse(res, 401, 'Not authorized, no token');
    }
};


// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return errorResponse(res, 403, 'Not authorized as an admin');
    }
  };

  export{
    admin,protect
  }

