
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {saltRounds} from '../config/auth.js';

const UserSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true, 'Please provide a username'],
            unique:true,
            trim:true,
            maxlength:[50, 'Username cannot be more than 50 characters']
        },
        email:{
            type:String,
            required:true,
            unique:true,
            match:[
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
              ],
        },
        password:{
            type:String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role:{
            type: String,
            enum: ['user', 'admin'],
            default:'user'
        },
        profileImage:{
            type:String,
            default:null,
        },

    },
    {
        timestamps:true
    }

);

UserSchema.pre('save',async function (next){
    if(!this.isModified('password')) return next();
    try {
        const salt=await bcrypt.genSalt(saltRounds);
        this.password= await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error)
    }
})
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
};


export default  mongoose.model('User',UserSchema)