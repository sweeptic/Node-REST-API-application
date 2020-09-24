

exports.getPosts = (req, res, next) => {
   //send response
   //status code is important !! (then catch ....)
   res.status(200).json({
      posts: [{ title: 'First Post', content: 'This is the first post' }]
   });
};

exports.createPost = (req, res, next) => {
   const title = req.body.title;
   const content = req.body.content;
   //create post in bd

   //this is just only confirmation that it was stored successfully
   res.status(201).json({
      message: 'Post created successfully',
      post: { id: new Date().toISOString(), title: title, content: content }
   })
}