import express from 'express';
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import { protect,teacherOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect , teacherOnly ,async(req,res)=>{
    try{
        const { title,description,classroomId,timeLimitMinutes } = req.body;

        const quiz = new Quiz({
            title,
            description,
            classroom : classroomId,
            createdBy : req.user.id,
            timeLimitMinutes: timeLimitMinutes || 30,
        });

        await quiz.save();

        res.status(201).json({
            msg: 'Quiz created Successfully',
            quiz : {
                id: quiz._id,
                title:quiz.title,
                classroom: quiz.classroom,
            },
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Server error'});
    }
});

router.post('/:quizId/add-question',protect,teacherOnly,async(req,res)=>{
    try{
        const { quizId } = req.params;
        const { questionText, options, correctOptionIndex, marks } = req.body;

        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.status(404).json({msg:"Quiz not Found"});
        }

        if(quiz.createdBy.toString() !== req.user.id){
            return res.status(403).json({msg:"not authorized"});
        }

        const question = new Question({
            classroom: quiz.classroom,
            createdBy: req.user.id,
            type:'mcq',
            questionText,
            options,
            correctOptionIndex,
            marks: marks||1,
        });

        await question.save();

        quiz.questions.push(question._id);
        await quiz.save();

        res.status(201).json({
            msg: 'Question added to quiz',
            questionId: question._id,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Server error'});
    }
});

router.get('/classroom/:classroomId',protect,async(req,res)=>{
    try{
        const quizzes = await Quiz.find({ classroom: req.params.classroomId }).populate('createdBy','username email').sort({createdAt:-1});
        res.json({ success:true, quizzes });
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Server error'});
    }
});

router.get('/:quizId',protect,async(req,res)=>{
    try{
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if(!quiz) return res.status(404).json({msg:'Quiz not found'});
        res.json({success:true,quiz});
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Server error'});
    }
});

export default router;

