//require('dotenv').config();
import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
//import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import videosRoutes from './routes/videos.js';
const app = express();


app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors());
app.use('/v1', videosRoutes);
const PORT = process.env.PORT || 8082;

mongoose.connect('mongodb://127.0.0.1:27017/xflix', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {console.log("Connected to MongoDB"); 
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))})
    .catch((error)=>{console.log(error.message)});

mongoose.set('useFindAndModify', false);
