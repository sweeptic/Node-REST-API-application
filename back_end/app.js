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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Content-Type, Authorization');
  next();
});

//i can parse incoming request bodies
//app use -  any method
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

//error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
})


const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.tnfyo.gcp.mongodb.net/Cluster0?retryWrites=true&w=majority'
const SECRET = '!+%G!THghfdgre+%R43trgfd44'


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(8080))
  .catch(err => console.log(err));

