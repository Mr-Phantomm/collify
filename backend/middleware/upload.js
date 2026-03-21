import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 10*1024*1024 },
    fileFilter:(req,file,cb)=>{
        if(file.mimetype === 'application/pdf'){
            cb(null,true)
        }else{
            cb(new Error('Only PDF files allowed'),false)
        }
    },
})

export default upload;
