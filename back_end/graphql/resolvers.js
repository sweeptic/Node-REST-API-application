const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

module.exports = {

   //createuser resolver
   createUser: async function ({ userInput }, req) {

      const errors = []
      if (!validator.isEmail(userInput.email)) {
         errors.push({ message: 'E-Mail is invalid.' })
      }
      if (validator.isEmpty(userInput.email) || !validator.isLength(userInput.password, { min: 5 })) {
         errors.push({ message: 'Password too short!' })
      }

      if (errors.length > 0) {
         const error = new Error('Invalid input.')
         error.data = errors;
         error.code = 422;
         throw error;
      }

      // if dont use async-await: 
      // return User.findOne().then() - use RETURN !
      const existingUser = await User.findOne({ email: userInput.email })
      if (existingUser) {
         const error = new Error('User exists already!');
         throw error;
      }
      const hashedPw = await bcrypt.hash(userInput.password, 12);
      const user = new User({
         email: userInput.email,
         password: hashedPw,
         name: userInput.name
      });

      const createdUser = await user.save();
      //_doc just the mongoose data without metadata. and overwrite _id field.
      return { ...createdUser._doc, _id: createdUser._id.toString() }
      //  res.status(201).json({ message: 'User created!', userId: result._id });
   },


   //login resolver
   login: async function ({ email, password }) {
      const user = await User.findOne({ email: email })
      if (!user) {
         const error = new Error('User not found.');
         error.code = 401;
         throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
         const error = new Error('Password is incorrent.');
         error.code = 401;
         throw error;
      }

      //email exist, password correct -> generate token
      const token = jwt.sign({
         userId: user._id.toString(),
         email: user.email
      }, 'somesupersecretsecret', { expiresIn: '1h' });
      return { token: token, userId: user._id.toString() };
   },

   //cretae post resolver
   createPost: async function ({ postInput }, req) {
      const errors = [];
      if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
         errors.push({ message: 'Title is invalid' })
      }
      if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })) {
         errors.push({ message: 'Content is invalid' })
      }
      if (errors.length > 0) {
         const error = new Error('Invalid input.')
         error.data = errors;
         error.code = 422;
         throw error;
      }
      const post = new Post({
         title: postInput.title,
         content: postInput.content,
         imageUrl: postInput.imageUrl
      });

      const createdPost = await post.save();
      //add post to users posts
      return {
         ...createdPost._doc,
         _id: createdPost._id.toString(),
         createdAt: createdPost.createdAt.toISOString(),
         updatedAt: createdPost.updatedAt.toISOString()

      };
   }




}