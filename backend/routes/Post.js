import express from 'express'
import Post from '../models/Post.js';
import Classroom from '../models/Classroom.js';
import { protect, teacherOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.get("/:classRoomId/get",protect,async (req,res)=>{
    try{
        const { classRoomId } = req.params;
        const classroom = await Classroom.findById(classRoomId);
        if(!classroom) return res.status(404).json({ msg: 'Classroom not found ' });

        const isTeacher = classroom.teacher.toString() === req.user.id;
        const isStudent = classroom.students.some(s=>s.toString() === req.user.id);
    
        if(!isTeacher && !isStudent){
            return res.status(403).json({msg : "Not Authorized "})
        }

        const posts = await Post.find({classroom : classRoomId}).populate('author', 'username email').populate('quiz_id').sort({createdAt : -1});

        res.json({
            success : true,
            posts
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Internal Server Error"
        })
    }
});

router.post("/:classRoomId/create",protect,teacherOnly,upload.array('attachments',5),async (req,res)=>{
    
    try{
        const {classRoomId} = req.params;
        const {type,title,content,meetLink,quiz_id,material_URL} =req.body;
        
        const classroom = await Classroom.findById(classRoomId);
        if(!classroom){
            return res.status(404).json({
                msg:"Classroom Not Found"
            });
        }

        if(classroom.teacher.toString()!== req.user.id){
            return res.status(403).json({
                msg:"Not Authorised",
            });
        }
        let attachmentsUrls = [];
        if(req.files && req.files.length>0){
            for(const file of req.files){
                const result = await cloudinary.uploader.upload_stream(
                    {resource_type : 'raw'},
                    (error,result)=>{
                        if(error)throw error;
                        attachmentsUrls.push(result.secure_url)
                    }
                ).end(file.buffer)
            }
        }

        const post = new Post({
            classroom : classRoomId,
            author : req.user.id,
            type,
            title,
            content,
            meetLink : type==="google_meet"?meetLink:undefined,
            quiz_id: type==="quiz"?quiz_id:undefined,
            material_URL:type==="material"?material_URL:undefined,
            attachements : attachmentsUrls || [],
        });

        await post.save();
        res.status(200).json({
            success:true,
            msg:"msg created Successfully",
            post
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Internal Server error"
        });
    }
});

export default router;
