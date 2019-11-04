let lat, lon;
const summaryPara = document.querySelectorAll('p')[1];
const displayPara = () => {
  summaryPara.style.visibility = 'visible';
};

if("geolocation" in navigator) {
  console.log('geolocation available');

  navigator.geolocation.getCurrentPosition(async position => {

  try {

  lat = position.coords.latitude;
  lon = position.coords.longitude;
  document.getElementById('latitude').textContent = lat.toFixed(2);
  document.getElementById('longitude').textContent = lon.toFixed(2);

  const api_url = `weather/${lat},${lon}`;
  const response = await fetch(api_url);
  const json = await response.json();
  const timeZone = json.weather.timezone.split('/');
  const location = timeZone[1];
  const air = json.air_quality.results[0].measurements[0];

  /* Weather HTML elements */
  document.getElementById('location').textContent = location;
  document.getElementById('summary').textContent = json.weather.currently.summary;
  document.getElementById('temperature').textContent = json.weather.currently.temperature;

  /* Air quality HTML elements */
  document.getElementById('aq_parameter').textContent = air.parameter;
  document.getElementById('aq_value').textContent = air.value;
  document.getElementById('aq_units').textContent = air.unit;
  document.getElementById('aq_date').textContent = air.lastUpdated;

  await displayPara();
  console.log(json);
} catch (error) {
    document.getElementById('aq_value').textContent = 'NO READING';
    // console.log('Something went wrong!');
}
  });
} else {
  console.log('geolocation not available');
}

const btn = document.querySelector('button');
const textInput = document.getElementById('inp');

const logData = async() => {
  const data = {
    lat,
    lon
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response = await fetch('/api', options); //await will wait until the promise returns/completes before executing
  const json = await response.json();
  console.log(json);
};

btn.addEventListener('click', logData);
