'use strict'

const express = require('express');
const cors = require('cors');
const {response } = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
require('dotenv').config();
app.use(cors());

// ROUTES : .get (name of route, callback function (request/response))
app.get('/', (request, response) => {response.send('hey world');});
app.get('/location', locationHandler);


function locationHandler(request, response){
    let city = request.query.city;
    let data = require('./server/data/location.json')[0];
    let location = new Location (data, city);
    response.send(location);
    console.log(city,data,location);
}
// Constructor to tailor our incoming raw data
function Location (obj, query){
    this.lat = obj.lat;
    this.lon = obj.lon;
    this.search_query = query;
    this.location = obj.display.name;
}
// Start our server!
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
// TEST?