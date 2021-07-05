import config from './config/config.js'
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

mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {console.log("Connected to MongoDB"); 
    app.listen(config.port, () => console.log(`Server running on port: ${config.port}`))})
    .catch((error)=>{console.log(error.message)});

mongoose.set('useFindAndModify', false);
process.on('unhandledRejection', (error, p) => {
    console.log('=== UNHANDLED REJECTION ===');
    console.dir(error.stack);
  });
  
