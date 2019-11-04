let lat, lon, weather, air, locale;
const summaryPara = document.querySelectorAll('p')[1];
const displayPara = () => {
  summaryPara.style.visibility = 'visible';
};

if("geolocation" in navigator) {
  console.log('geolocation available');

  navigator.geolocation.getCurrentPosition(async position => {

  try {

    lat = position.coords.latitude.toFixed(2);
    lon = position.coords.longitude.toFixed(2);
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;

    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    weather = json.weather.currently;
    air = json.air_quality.results[0].measurements[0];
    const timeZone = json.weather.timezone.split('/');
    locale = timeZone[1];

    /* Weather HTML elements */
    document.getElementById('location').textContent = locale;
    document.getElementById('summary').textContent = weather.summary;
    document.getElementById('temperature').textContent = weather.temperature;

    /* Air quality HTML elements */
    document.getElementById('aq_parameter').textContent = air.parameter;
    document.getElementById('aq_value').textContent = air.value;
    document.getElementById('aq_units').textContent = air.unit;
    document.getElementById('aq_date').textContent = air.lastUpdated;

    await displayPara();

} catch (error) {
    document.getElementById('aq_value').textContent = 'NO READING';
    console.log('Something went wrong!');
}

  const data = {
    lat,
    lon,
    weather,
    air,
    locale
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const db_response = await fetch('/api', options); //await will wait until the promise returns/completes before executing
  const db_json = await db_response.json();
  console.log(db_json);
  });

} else {
  console.log('geolocation not available');
}
