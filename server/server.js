'use strict'
// Bring in our dependencies
const express = require('express');
const cors = require('cors');
const { response } = require('express');
require('dotenv').config();

// Declare our port for our server to listen on

const PORT = process.env.PORT || 3000;

// start/instanciate Express
const app = express();

// Use CORS (cross origin resource sharing)
app.use(cors());

// HOME ROUTE
// .get (name of route, callback function (request/response))
app.get('/', (request, response) => {
    response.send('hey world');
});

// Constructor to tailor our incoming raw data

// Start our server!
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
