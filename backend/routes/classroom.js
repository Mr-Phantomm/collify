import express from 'express';
import Classroom from '../models/Classroom.js';
import { protect,teacherOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/get',protect,async(req,res)=>{
    try{
        let classroom;
        if(req.user.role==='teacher'){
            classroom=await Classroom.find({ teacher:req.user.id}).populate('students','username email').sort({createdAt: -1});
        }
        else{
            classroom=await Classroom.find({ students: req.user.id }).populate('teacher','username email').sort({createdAt: -1});
        }
        res.json({
            success: true,
            role: req.user.role,
            classroom
        });
    }catch(error){
        console.log('Error fetching classrooms: ',error);
        res.status(500).json({
            success:false,
            msg:"Server error"
        });
    }
})

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

        res.json({msg : "Joined Classroom Successfully!!",classroom:{id:classroom._id,name:classroom.name,joinCode:classroom.joinCode}});
    }catch(err){
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
