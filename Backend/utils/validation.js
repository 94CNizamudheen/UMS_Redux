import {errorResponse} from './response.js';

export  const validateRegisterInput=(req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username|| !email||!password){
        return errorResponse(res,400,'Please provide all required fields')
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!emailRegex.test(email)){
        return errorResponse(res,400,'Please provide a valid email')
    }
    if(password.length<6){
        return errorResponse(res,400,'Password must be at least 6 characters')
    }
    next();
};

export const validateUserInput=(req,res,next)=>{
    const {username,email,password,role}=req.body;

    if(req.method==='POST' && (!username||!email||!password)){
        return errorResponse(res,400,'Please provide all required fields')
    }
    if(email){
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            return errorResponse(res,400,'Please provide a valid email')
        }
    }
    if(password && password.length<6){
        return errorResponse(res,400,'Password must be at least 6 characters')
    };
    if(role && !['user','admin'].includes(role)){
        return errorResponse(res,400, 'Role must be either user or admin')
    }
    next()
}

export const validateLoginInput=(req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return errorResponse(res,400,'Please provide email and password')
    }
    next();
}
