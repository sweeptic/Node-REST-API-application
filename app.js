// request -> middleware -> next() middleware -> res.send() response

// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded());   // x-www-form-urlencoded -default data when submitted form post request

app.use(bodyParser.json());   //application/json


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


app.listen(8080);