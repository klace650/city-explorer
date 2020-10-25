'use strict'
// -----------------------------------------
// DEPENDENCIES
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
// -----------------------------------------
// ENVIROMENT
require('dotenv').config();
// -----------------------------------------
// POSTGRES
const client = new pg.Client(process.env.DATABASE_URL);
// -----------------------------------------
// APPLICATION
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// -----------------------------------------
// ROUTES
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailHander);
app.get('/yelp', movieHandler);
app.use('*', notFoundler);

// -----------------------------------------
// HANDLERS
function notFoundler (request, response){
  response.status(404).send('Client Error?');
  // Do I need this?
  console.log(request);
}

function locationHandler(request, response){
  let city = request.query.city;
  let key = process.env.LOCATION_API_KEY;
  const URL = `https://us1.locationiq.com/v1/search.php/?key=${key}&q=${city}&format=json`;

  superagent.get(URL)
    .then(data => {
      let location = new Location (data.body[0], city);
      response.status(200).send(location);
      console.log('Searched City: ',city);
    })
    .catch(error => {
      response.status(500).send('Server Issue @ Location')
    })
}

function weatherHandler(request, response){
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let key = process.env.WEATHER_API_KEY;
  const URL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

  superagent.get(URL)
    .then(data => {
      let forecastArr = data.body.data.map(data => {
        return new Weather(data);
      });
      response.send(forecastArr);
    })
    .catch(error => {
      response.status(500).send('Server Issue @ Weather');
    });
}

function trailHander (request, response){
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let key = process.env.TRAIL_API_KEY;
  const URL= `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=50&key=${key}`;
  // https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200955913-600f2c90e9a4c7c5e293cbff819aff3e

  superagent.get(URL)
    .then(data =>{
      let trailArr = data.body.trail.map(data => {
        return new Trail(data);
      });
      console.log(trailArr);
      response.send(trailArr);
    })
    .catch(error => {
      response.status(500).send('Server Issue @ Trails');
    });
}

function movieHandler (request, response){
  let searched = request.query.search_query;
  let key = process.env.MOVIE_API;
  const URL = `https://api.themoviedb.org/3/authentication/token/new?api_key=${key}`;

  superagent.get(URL)
    .then(data =>{
      let search = data.body.data.map(data => {
        return new Movie (data);
      });
      response.send(searched);
    })
    .catch(error => {
      response.status(500).send('Sever Issue @ Movies');
    })
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
function Trail (obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditions;
  this.condition_date = obj.conditionDate;
  this.condition_time = obj.conditionTime;
}
function Movie(obj){
  this.title = obj.title;
  this.overview = obj.overview;
}

// -----------------------------------------
// SERVER
// client.connect().then(()=> 

app.listen(PORT,()=>{
  console.log(`SERVER NOW LISTENING TO ${PORT}...chill`)});
// );
