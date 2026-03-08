import express from 'express'
import Post from '../models/Post';
import { protect, teacherOnly } from '../middleware/auth';
const router = express.Router();

router.get("/:classRoomId/get",protect,async (req,res)=>{
    try{
        const Posts = await Post.find({classroom:req.params.classRoomId});
        return res.status(200).json({
            success:true,
            msg:"Posts fetched Successfully!",
            Posts
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Internal Server Error"
        })
    }
});

router.post("/:classRoomId/create",protect,teacherOnly,async (req,res)=>{
    
    try{
        const {classRoomId} = req.params;
        const {type,title,content,meetLink,quiz_id,attachments,material_URL} =req.body;
        
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

        const post = new Post({
            classroom : classRoomId,
            author : req.user.id,
            type,
            title,
            content,
            meetlink : type==="google_meet"?meetlink:undefined,
            quizId: type==="quiz"?quizId:undefined,
            material_URL:type==="material"?material_URL:undefined,
            attachements : attachements || [],
        });

        await post.save();
        res.status(200).json({
            success:true,
            msg:"msg created Successfully",
            post
        });
    }catch(err){
        console.err(err);
        return res.status(500).json({
            success:false,
            msg:"Server error"
        });
    }
});
