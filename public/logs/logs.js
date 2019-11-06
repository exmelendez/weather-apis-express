const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(titleUrl, {attribution});
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data) {
    const marker = await L.marker([item.lat, item.lon]).addTo(mymap);

    const txt = await `The weather here in ${item.locale} is ${item.weather.summary} with a temperature of ${item.weather.temperature}° F. The concentration of particulate matter (${item.air.parameter}) is ${item.air.value} ${item.air.unit} last read on ${item.air.lastUpdated}.`;

    marker.bindPopup(txt);
  }
  console.log(data);
}
