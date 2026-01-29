import express from 'express';
import Attempt from '../models/Attempts.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:quizId/start',protect, async (req,res) => {
    try{
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if(!quiz)return res.status(404).json({msg: 'Quiz not found'});

        const existing = await Attempt.findOne({
            student:req.user.id,
            quiz: quiz._id,
            isSubmitted: true,
        });
        if(existing) return res.status(400).json({ msg: 'Already submitted this quiz'});

        const attempt = new Attempt({
            student: req.user.id,
            quiz: quiz._id,
            totalMarks: quiz.totalMarks,
        });

        await attempt.save();

        const safeQuestions = quiz.questions.map(q =>({
            _id: q._id,
            questionText: q.questionText,
            option: q.options.map(opt=>({text:opt.text})),
            marks:q.marks,
        }));

        res.json({
            attemptId:attempt._id,
            quizTitle: quiz.title,
            questions:safeQuestions,
            timeLimitMinutes: quiz.timeLimitMinutes,
        });

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Server error'});
    }
});

router.post('/:attemptId/submit',protect,async (req,res)=>{
    try{
        const { answers } = req.body;

        /// answers--> question,selectedOptionIndex
        const attempt = await Attempt.findById(req.params.attemptId);
        if(!attempt) return res.status(404).json({ msg: 'Attempt not found' });
        
        if(attempt.student.toString() !== req.user.id ){
            return res.status(403).json({msg : 'Not your attempt'});
        }

        if(attempt.isSubmitted){
            return res.status(400).json({msg: 'Already Submitted'});
        }

        const questionIds=answers.map(a=>a.question);
        const questions=await Question.find({_id: {$in : questionIds}});

        let score = 0;
        answers.forEach(ans => {
            const q = questions.find(qq=>qq._id.toString()===ans.question.toString());
            if(q&&q.correctOptionIndex === ans.selectedOptionIndex) {
                score += q.marks || 1;
            }
        });

        attempt.answers=answers.map(a=>({
            question:a.question,
            selectedOptionIndex:a.selectedOptionIndex
        }));

        attempt.score=score;
        attempt.submittedAt = new Date();
        attempt.isSubmitted=true;

        await attempt.save();
        res.json({
            msg:'Quiz submitted successfully',
            score,
            totalMarks:attempt.totalMarks,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Server error'});
    }
});

export default router;
