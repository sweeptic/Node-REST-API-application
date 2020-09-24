// request -> middleware -> next() middleware -> res.send() response

// const http = require('http');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/add-product', (req, res, next) => {
   console.log(('This is my homepage'));
   res.send('<form action="/product" method="POST"> <input type="text" name="title"/><button type="submit">Submit</button></form>');

})

app.use('/product', (req, res, next) => {
   console.log(req.body);
   res.redirect('/');
})

app.use('/', (req, res, next) => {
   res.send('<h1>Hello from express</h1>');
})

app.listen(3020);

// const server = http.createServer(app);
// server.listen(3020);