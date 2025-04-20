
import { errorResponse } from "../utils/response.js";

export const errorHandler = async (err, req, res, next) => {
    try {
        console.error(err)
        // Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            return errorResponse(res, 400, message);
        };
        // Mongoose duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            return errorResponse(res, 400, message);
        };
        // Mongoose bad ObjectId error
        if (err.name === 'CastError') {
            const message = `Resource not found`;
            return errorResponse(res, 404, message);
        }
        // JWT error
        if (err.name === 'JsonWebTokenError') {
            return errorResponse(res, 401, 'Invalid token');
        }
        // JWT expired error
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Token expired');
        }

        return errorResponse(res,500,err.message||"Server Error")
    } catch (error) {

    }
};


