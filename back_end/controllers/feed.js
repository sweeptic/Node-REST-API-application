const { validationResult } = require('express-validator');


const Post = require('../models/post')

//title, author, date, image, content

exports.getPosts = (req, res, next) => {
   //send response
   //status code is important !! (then catch ....)
   res.status(200).json({
      posts: [{

         _id: '1',
         title: 'First Post',
         content: 'This is the first post',
         imageUrl: 'duck/IMG_1257.JPG',
         creator: {
            name: 'SurferBoy'
         },
         createdAt: new Date()


      }]
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