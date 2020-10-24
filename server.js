'use strict'

// -----------------------------------------
// GLOBALS
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL);

require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// -----------------------------------------
// ROUTES
app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);
// app.get('/trails', trailHander);


// -----------------------------------------
// HANDLERS

function locationHandler(request, response){
  let city = request.query.city;
  let key = process.env.LOCATION_API_KEY;
  const URL = `https://us1.locationiq.com/v1/search.php/?key=${key}&q=${city}&format=json`;
  superagent.get(URL).then(data => {
    let location = new Location (data.body[0], city);
    response.status(200).send(location);
  })
}
// function weatherHandler(request, response){
//   let lat = request.query.latitude;
//   let lon = request.query.longitude;
//   let key = process.env.WEATHER_API_KEY;
//   const URL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

//   superagent.get(URL).then(data => {
//     let forecast = data.body.data.map(forecast => {
//       new Weather (forecast);
//       return forecast;
//       // Line below logs correct data also - still isn't making it to the page.
//       // console.log(forecast.weather.description);
//     })
//     response.status(200).send(forecast);
//   })
// }
// function trailHander (request, response){
//   let lat = request.query.latitude;
//   let lon = request.query.longitude;
//   let key = process.env.TRAIL_API_KEY;

//   const URL= `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
//   superagent.get(URL).then(data =>{
//     let trail = data.body.trails.map(trail =>
//       new Trail(trail));
//     response.status(200).send(trail);
//   });
// }
// function serverError (request, response){
//   response.status(500).send("Server Error");
//   console.log(request);
// }
// function clientError (request, response){
//   response.status(404).send("Client Error");
//   console.log(request);
// }

// -------------------------------------------
// CONSTRUCTORS
function Location (obj, query){
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}
// function Weather (obj){
//   this.forecast = obj.weather.description;
//   // console.log(this.forecast);
//   // this.forecast pulls correct data - just isn't making it on the page//
//   this.time = obj.datetime;
// }
// function Trail (obj){
//   this.name = obj.name;
//   this.location = obj.location;
//   this.length = obj.length;
//   this.stars = obj.stars;
//   this.star_votes = obj.starVotes;
//   this.summary = obj.summary;
//   this.trail_url = obj.url;
//   this.conditions = obj.conditions;
//   this.condition_date = obj.conditionDate;
//   this.condition_time = obj.conditionTime;
// }

// -----------------------------------------
// SERVER
// client.connect().then(()=> 

app.listen(PORT,()=>{
  console.log(`SERVER NOW LISTENING TO ${PORT}...chill`)});
// );
