// request -> middleware -> next() middleware -> res.send() response

// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers');
const { graphql } = require('graphql');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, 'someDateHere' + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


// app.use(bodyParser.urlencoded());   // x-www-form-urlencoded -default data when submitted form post request

app.use(bodyParser.json());   //application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images'))); //absolute path + images folder


//set header any response -because we built rest api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //* all domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  //client can send extra authorization  data in the header
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
//move validators into our resolver
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true, //get request use this. - thats why use 'use' and not 'use' method.
  formatError(err) {
    // return err; //default error format
    if (!err.originalError) { //technical error. 
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occured.';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data }
  }


}))

//i can parse incoming request bodies
//app use -  any method
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
})




const MONGODB_URI = 'mongodb+srv://olive4:hardfloor@nodejs.zzg9t.mongodb.net/nodejs_database?retryWrites=true&w=majority'


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(8080))
  .catch(err => console.log(err));
