// request -> middleware -> next() middleware -> res.send() response

// const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded());   // x-www-form-urlencoded -default data when submitted form post request

app.use(bodyParser.json());   //application/json

//i can parse incoming request bodies
//app use -  any method
app.use('/feed', feedRoutes);


app.listen(8080);