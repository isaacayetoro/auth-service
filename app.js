const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const api = require('./routes/api.routes');


// Parsing the json body
//request size limit
app.use(bodyParser.urlencoded({
    limit: "1mb",
    extended: false
}));
app.use(bodyParser.json({
    limit: "1mb"
}));


// allow cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// use the router /api
app.use('/api', api);


// Error Handler
app.use(function (err, req, res, next) {

  // render the error page
  console.error(err);
    console.log(err.message);  
  res.status(500).send({
    status: 'ERROR',
    message: err || 500,
    data: null
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});


 module.exports = app;