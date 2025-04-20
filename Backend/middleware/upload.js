
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)



const uploadDir= path.join(__dirname,'../uploads');

// Create uploads directory if it doesn't exist
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
};

// Configure storage
const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadDir);
    },
    filename:function(req,file,cb){
        const uniqueSuffix= Date.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,`${file.filename}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
});


// Check file type
const fileFilter= (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname=allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType=allowedTypes.test(file.mimeType)
    if(extname && mimeType){
        return cb(null,true);
    }else{
        cb(new Error('Only image files are allowed!'))
    }
};

const upload= multer({
    storage,
    limits:{ fileSize: 2 * 1024 * 1024},
    fileFilter
})
export const uploadProfileImage= upload.single('profileImage')

