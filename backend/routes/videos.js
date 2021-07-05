import express from 'express';
import { views, Videos, addVideos, videosId, updateVotes} from '../controllers/videos.js';
import validate from '../middleware/validate.js'
import getUser from '../validiations/user.validiation.js'
const router = express.Router();
// http://localhost:5000/v1

router.get('/videos', Videos);
router.patch('/videos/:videoId/views', views);
router.get('/videos/:videoId', validate(getUser), videosId);

router.post('/videos', addVideos);
router.patch('/videos/:videoId/votes', updateVotes);
export default router;