import express from 'express';
import Classroom from '../models/Classroom.js';
import { protect,teacherOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/create',protect,teacherOnly,async (req,res)=>{
    try{
        const { name } = req.body;

        const classroom=new Classroom({
            name,
            teacher:req.user.id,
        });

        await classroom.save();

        res.status(201).json({
            msg:"Classroom Created",
            classroom: {
                id : classroom._id,
                name : classroom.name,
                joinCode : classroom.joinCode,
            },
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Server error"});
    }
});

router.post('/join',protect,async(req,res)=>{
    try{
        const { joinCode } = req.body;

        const classroom = await Classroom.findOne( { joinCode } );
        
        if(!classroom){
            return res.status(404).json({msg: "Invalid Join Code"});
        }

        if(classroom.students.includes(req.user.id)){
            return res.status(400).json({ msg : " User Already Enrolled "});
        }

        classroom.students.push(req.user.id);
        await classroom.save();

        res.json({msg : "Joined Classroom Successfully!!",classRoomId:classroom._id});
    }catch(err){
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
