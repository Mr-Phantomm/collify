import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req,res) => {
    const { username,email,password,role }=req.body;

    try{
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:'User already Exists'});
        }
        user =new User({
            username,
            email,
            password,
            role,
        });

        await user.save();

        const payload = {
            id: user.id,
            role: user.role,
        };
        
        const token = jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ token });
    }catch(err){
        console.log(err.message);
        res.status(500).json({msg: 'Server error'});
    }

});

router.post('/login',async (req,res)=>{
    const { email,password } = req.body;

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg : "Invalid Credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({msg : "Invalid Credentials"});
        }
        
        const payload={
            id:user.id,
            role:user.role
        };

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '7d'}); 

        res.json({token});

    }catch(err){
        console.log(err.message);
        res.status(500).json({msg:"Server error"});
    }
});

export default router;


// const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
// );

