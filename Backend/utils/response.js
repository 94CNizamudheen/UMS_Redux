

const successResponse=(res,statusCode,data)=>{
    return res.status(statusCode).json({
        success:true,
        data
    });
};

const errorResponse=(res,statusCode,data)=>{
    return res.status(statusCode).json({
        success:true,
        data
    })
};

export {
    successResponse,
    errorResponse
}
