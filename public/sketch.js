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
    const timeZone = json.weather.timezone.split('/');
    locale = timeZone[1];

    /* Weather HTML elements */
    document.getElementById('location').textContent = locale;
    document.getElementById('summary').textContent = weather.summary;
    document.getElementById('temperature').textContent = weather.temperature;

    if(json.air_quality.results.length > 0) {
      air = json.air_quality.results[0].measurements[0];

      document.getElementById('aq-results').textContent = `The concentration of particulate matter (${air.parameter}) is ${air.value} ${air.unit} last read on ${air.lastUpdated}`;
    } else {
      throw 'no air quality results obtained from API';
    }

} catch (error) {
    console.error(error);
    air = {  value: -1 };
    document.getElementById('aq-results').textContent = 'No air quality reading';
}

  await displayPara();

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
