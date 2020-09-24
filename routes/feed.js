
const express = require('express');


const feedController = require('../controllers/feed')

const router = express.Router();

//logic executed when request reached this
//                   GET handle /feed/posts
router.get('/posts', feedController.getPosts);      //PATH - METHOD pair

//POST /feed/post
router.post('/post', feedController.createPost); 

module.exports = router;