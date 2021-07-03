import {updoViews,  getVideos, addVids, getVideoById, updoVotes, filteredVideos } from '../service/videosServices.js';
import getUser from '../validiations/user.validiation.js'
import objectId from '../validiations/custom.validiation.js'
export const Videos = async (req, res) => {
    let sv = ['releaseDate', 'viewCount']
    let soby
    if(sv.includes(req.query.sortBy)){
        soby = req.query.sortBy;
    }else{
        soby = sv[0];
    }
    if(!req.query.genres && !req.query.title && !req.query.contentRating){
        const videos = await getVideos(soby);
        res.send({videos:videos});
    } 
    let {genres, contentRating, title } = req.query;
    let q = {}
    if(genres != null){
        var nameArr = genres.split(',');
        q.genre = nameArr;
    }
    if(contentRating != null){
        let cr = ["Anyone", "7+", "12+", "16+", "18+"];
        let n = cr.indexOf(contentRating)
        let crl = []
        for(let i=0; i<=n; i++){
            crl.push(cr[i]);
        }
        q.contentRating = crl;
    }
    if (title != null) {
        q.title = new RegExp("^"+title,"i")
    } 
    let videos = await filteredVideos(q, soby);   
    res.send({videos:videos});
};

export const videosId = async (req,res) => {
    //objectId(req.params.videoId);
    
    const vid = await getVideoById(req.params.videoId);
    res.send(vid)
}

export const addVideos = async (req, res, next) => {
    const arr = req.body;
    console.log(Array.isArray(arr))
    if(!Array.isArray(arr)){
        const v = await addVids(arr);
        res.status(201).send(v);
    }else{
        try {
            let Jsonarr = [];
            for (let i in arr) {
                const v = await addVids(arr[i]);
                Jsonarr.push(v)
            };
            res.status(201).send(Jsonarr);
        } catch (err) {
            next(err);
        }
    }
    
   
}

export const updateVotes = async(req, res) => {
    try{
        var updateObject = req.body; 
        var id = req.params.videoId;
        const vid = await updoVotes(id, updateObject);
        res.status(204).json(vid)
    }catch(error){
        console.log(error)
    }
    
}

export const views = async(req, res) => {
    try{ 
        var id = req.params.videoId;
        const vid = await updoViews(id);
        res.status(204).send()
    }catch(error){
        console.log(error)
    }
}