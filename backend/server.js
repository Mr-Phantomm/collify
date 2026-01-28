import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

dotenv.config({path: '../.env'});
connectDB();

const app = express();

app.use(cors({origin: 'https://localhost:3000'}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API Running");
});

app.use('/auth',authRoutes);

app.listen(process.env.PORT, ()=>console.log(`Server on port ${process.env.PORT}`));