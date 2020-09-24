
const express = require('express');


const feedController = require('../controllers/feed')

const router = require('router');

//logic executed when request reached this
//                   GET handle /feed/posts
router.get('/posts', feedController.getPosts);      //PATH - METHOD pair

module.exports = router;