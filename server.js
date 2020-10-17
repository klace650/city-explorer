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
app.get('/weather', weatherHandler);

function weatherHandler(request, response){
    let city = request.query.city;
    let weatherArray = [];
    let weatherData = require('./data/weather.json');
    weatherData.data.forEach(forecast => {
        let weatherForecast = new Weather (forecast);
        weatherArray.push(weatherForecast);
    });
    response.send(weatherArray);
};

function locationHandler(request, response){
    let city = request.query.city;
    let data = require('./data/location.json')[0];
    let location = new Location (data, city);
    response.send(location);
    console.log(city,data,location);
}
// Constructor to tailor our incoming raw data
function Location (obj, query){
    this.latitude = obj.lat;
    this.longitude = obj.lon;
    this.search_query = query;
    this.formatted_query = obj.display_name;
}
function Weather (obj){
    this.forecast = obj.weatherForecast.description;
    this.time = obj.datetime;

};

// Start our server!
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});
// TEST?