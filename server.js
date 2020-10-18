'use strict'

// GLOBALS
const express = require('express');
const cors = require('cors');
const {response } = require('express');
const superagent = require('superagent');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

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
// -----------------------------------------

function locationHandler(request, response){
  let city = request.query.city;
  let key = process.env.LOCATION_API_KEY;

  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  superagent.get(URL).then(data => {
    let location = new Location (data.body[0], city);
    response.status(200).json(location);
  });
}

// -------------------------------------------
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
