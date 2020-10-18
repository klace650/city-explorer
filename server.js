'use strict'

// GLOBALS
const express = require('express');
const cors = require('cors');
const {response } = require('express');
const superagent = require('superagent');

require('dotenv').config();

app.use(cors());
const app = express();
const PORT = process.env.PORT || 3000;

// ROUTES
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);


// HANDLERS
function weatherHandler(request, response){
  let weatherArray = [];
  let weatherData = require('./data/weather.json');
  weatherData.data.forEach(forecast => {
    let weatherForecast = new Weather (forecast);
    weatherArray.push(weatherForecast);
  });
  response.send(weatherArray);
}

function locationHandler(request, response){
  let city = request.query.city;
  let data = require('./data/location.json')[0];
  let location = new Location (data, city);
  response.send(location);
}


// CONSTRUCTORS
function Location (obj, query){
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}
function Weather (obj){
  this.forecast = obj.weather.description;
  this.time = obj.datetime;
}

// SERVER
app.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`)
});
