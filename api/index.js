import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MongoLocal).then(()=>{
    console.log("Connected to MongoDb");
}).catch((err)=>{
    console.log("DB connection error");
});

const app = express();
app.use(express.json());

app.listen(3000, ()=>{
    console.log("Server is running in 3000 port!");
})

app.use("/api/user", userRouter);
app.use("/api/auth/", authRouter);