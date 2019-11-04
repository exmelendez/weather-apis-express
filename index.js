const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public')); //diretory or file name of where to go (going to public folder)
app.use(express.json({ limit: '1mb' })); //express.json will parse incoming data as JSON

const database = new Datastore('database.db'); //crate new object + point to local file on the computer running the server
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
      if(err) {
        response.end();
        return;
      }
      response.json(data);
  });
});

app.post('/api', (request, response) => { //request variable holds everything within request. Response is variable used to send things back
  console.log('I got a request');
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;

  database.insert(data); // insert data into DB
  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);

  const weather_url = `https://api.darksky.net/forecast/b45595dd5b4dac055bf17abc5aad62cd/${lat},${lon}`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    air_quality: aq_data
  };

  response.json(data); //This is what gets sent back to the client side
});
