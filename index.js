const express = require('express');
const app = express();

app.listen(3000, () => console.log('listening at 3000')); //Listening on port 3000

app.use(express.static('public')); //Serving public folder
app.use(express.json({ limit: '1mb' })); //ability to interpret incoming data as JSON

app.post('/api', (request, response) => {
    console.log('I got a request!');
    console.log(request.body);

    const data = request.body;

    response.json({
        status: 'success',
        latitude: data.lat,
        longitude: data.long
    });
});