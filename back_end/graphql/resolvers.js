const bcrypt = require('bcryptjs');

const User = require('../models/user');


module.exports = {
   createUser: async function ({ userInput }, req) {

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

   }
}