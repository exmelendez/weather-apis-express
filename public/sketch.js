//Setup function is needed for the P5JS library
function setup() {
  noCanvas(); //P5 is primarily used for drawing/canvas, but it is not needed for this project.
  const video = createCapture(VIDEO); // P5 video/capture variable
  video.size(160, 120); //resizing as it is naturally very large.

  const btn = document.querySelector('button');
  const textInput = document.getElementById('inp');

  const clearTextInput = () => {
    textInput.value = "";
  };

  const getLocation = () => {

    if("geolocation" in navigator) {
        console.log('geolocation available');

        navigator.geolocation.getCurrentPosition(async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          document.getElementById('latitude').textContent = lat;
          document.getElementById('longitude').textContent = lon;

          video.loadPixels(); //Lets P5 know that a canvas is needed. Takes video element, load pixels onto a canvas so it can then be converted into Base64.
          const image64 = video.canvas.toDataURL();

          const data = {
            lat,
            lon,
            mood: textInput.value,
            image64
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

          await clearTextInput();
        });

    } else {
        console.log('geolocation not available');
    }
  };

  btn.addEventListener('click', getLocation);
}
