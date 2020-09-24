// request -> middleware -> next() middleware -> res.send() response

// const http = require('http');

const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

//i can parse incoming request bodies
const bodyParser = require('body-parser');

//app use -  any method
app.use('/feed', feedRoutes);


app.listen(8080);