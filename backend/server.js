import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import classroomRoutes from './routes/classroom.js';
// import { protect,teacherOnly } from './middleware/auth.js';


dotenv.config({path: '../.env'});
connectDB();

const app = express();

app.use(cors({origin: 'https://localhost:3000'}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API Running");
});

// app.get('/api/protected',protect,(req,res)=>{
//     res.json({msg:`Hello ${req.user.role}! and your user id is ${req.user.id}`});
// })

app.use('/auth',authRoutes);
app.use('/classroom',classroomRoutes);

app.listen(process.env.PORT, ()=>console.log(`Server on port ${process.env.PORT}`));