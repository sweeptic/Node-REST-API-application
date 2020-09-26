const { validationResult } = require('express-validator');


const Post = require('../models/post')

//title, author, date, image, content

exports.getPosts = (req, res, next) => {
   Post
      .find()
      .then(posts => {
         res
            .status(200)
            .json({ message: 'Fetched posts successfully.', posts: posts })
      })
      .catch(err => {
         if (!err.statusCode) {
            err.statusCode = 500;   //server side error
         }
         next(err);
      });
};




exports.createPost = (req, res, next) => {
   //server side validation
   const errors = validationResult(req);
   if (!errors.isEmpty()) {

      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422; //possible validation error . outside promise-then
      throw error;         // <--- automatically exit the function execution here
      //and try to reach the next error handling function or error handling middleware

      // return res
      //    .status(422)
      //    .json({
      //       message: 'Validation failed, entered data is incorrect.',
      //       errors: errors.array()
      //    })
   }

   //get data from body
   const title = req.body.title;
   const content = req.body.content;

   //create a new post
   const post = new Post({
      title: title,
      content: content,
      creator: { name: 'SurferBoy' },
      imageUrl: 'images/IMG_1257.jpg'
   })

   //save post
   post.save()

      //get success result
      .then((result) => {
         console.log(result);


         //this is just only confirmation that it was stored successfully
         res.status(201).json({
            message: 'Post created successfully',
            post: result
         })


      })
      //get unsuccessfull result if there is any
      .catch(err => {
         if (!err.statusCode) {
            err.statusCode = 500;   //server side error
         }
         // throw err // inside promise-then. will not reach next error handling middleware.
         // //possible storing post error 
         next(err); //go and reach the next error handling middleware.
      })
}



exports.getPost = (req, res, next) => {
   const postId = req.params.postId;
   Post.findById(postId)
      .then(post => {
         if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error; //throw error inside then block (not catch). the next 'catch' block will be reached
         }
         res.status(200).json({ message: 'Post fetched', post: post })
      })
      .catch(err => {
         //throwing error end up in this function.
         if (!err.statusCode) {
            err.statusCode = 500;   //server side error
         }
         next(err);
      })
}