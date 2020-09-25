

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
   const title = req.body.title;
   const content = req.body.content;
   //create post in bd

   //this is just only confirmation that it was stored successfully
   res.status(201).json({
      message: 'Post created successfully',
      post: {
         _id: new Date().toISOString(),
         title: title,
         content: content,
         creator: {
            name: 'SurferBoy',
            createdAt: new Date()
         }

      }
   })
}