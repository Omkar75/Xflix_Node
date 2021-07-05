import Videos from "../model/videoSchema.js";
import httpStatus from 'http-status';
import ApiError from "../utils/ApiError.js";

export const getVideoById = async(id) => {
    const videoById = await Videos.findById(id);
    if(!videoById){
        throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id")
    }
    return videoById;    
};

export const getVideos = async (soby) => {
    return await Videos.find({}).sort({[soby]: -1});
};
export const filteredVideos = async (q, soby) => {
    let fv = await Videos.find(q).sort({[soby]: -1})
    console.log(fv)
    return fv;
}
/*export const sortVideos = async (que) => {
    let fv = await Videos.find({}).sort({[que]: -1})
    return fv;
}*/

export const addVids = async(i) => {
    const user_ans = await Videos.create({
        "videoLink": i.videoLink,
        "title": i.title,
        "genre": i.genre,
        "contentRating": i.contentRating,
        "releaseDate": i.releaseDate,
        "previewImage": i.previewImage,
    });
    const savedVid = await Videos.findOne({title: i.title, videoLink: i.videoLink, genre: i.genre})
    return savedVid
}

export const updoVotes = async(id, updateObject) =>{
    const video = await getVideoById(id)
    if(updateObject.vote === 'downVote'){
        await Videos.updateOne({ "_id": video.id}, { $inc: {"votes.downVotes": 1} })
        const idvid = await Videos.findOne({_id: video.id}); 
        console.log(idvid);
        return idvid;
    }
    if(updateObject.vote === 'upVote'){
        await Videos.updateOne({ "_id": video.id}, { $inc: {"votes.upVotes": 1} })
        const idvid = await Videos.findOne({_id: video.id}); 
        console.log(idvid);
        return idvid;
    }
}
export const updoViews = async(id) => {
    await Videos.updateOne({ "_id": id}, { $inc: {"viewCount": 1} })
    const idvid = await Videos.findOne({_id: id}); 
    console.log(idvid);
    return idvid;
}
