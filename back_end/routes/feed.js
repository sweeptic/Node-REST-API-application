
const express = require('express');

const { body } = require('express-validator'); //middleware to apply server side validation

const feedController = require('../controllers/feed')

const router = express.Router();

//logic executed when request reached this
//                   GET handle /feed/posts
router.get('/posts', feedController.getPosts);      //PATH - METHOD pair

//POST /feed/post
router.post('/post', [

   body('title')
      .trim()
      .isLength({ min: 5 }),
   body('content')
      .trim()
      .isLength({ min: 5 })

],
   feedController.createPost
);

module.exports = router;