import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/UserRouter.js';
import TripRouter from './routes/TripRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6001;

// Middleware

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user',UserRouter);
app.use('/api/trips', TripRouter)

// Connect to MongoDB

 mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
 })
 .then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server port: ${PORT}`);

    })
 })
 .catch((err)=>{
    console.error(`${err} - did not connect to the database`);
 });