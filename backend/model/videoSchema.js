import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
    viewCount: {
        type: Number,
        default: 0
    },
    votes:{
        upVotes:{
            type: Number,
            default: 0
        },
        downVotes:{
            type: Number,
            default: 0
      
        }
    },
    videoLink: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    contentRating: {
        type: String,
        required: true,
        trim: true,
    },
    releaseDate: {
        type: String,
        required: true,
        trim: true,
    },
    previewImage: {
        type: String,
        required: true,
        trim: true,
    },
    
    
	
});

const Videos = mongoose.model('Videos', videoSchema);
export default Videos;