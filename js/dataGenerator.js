var fs = require('fs');
var geocoder = require('local-reverse-geocoder');
//var geocoder = require('geocoder');

fs.readFile("docs/datasets/earthMeteoriteLandings.json", function (err, data) {
    if (err) {
        throw err;
    }
    // console.log(data.toString());
    data = JSON.parse(data);

    var points = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].geolocation != undefined) {
            tmp = {
                latitude: data[i].geolocation.coordinates[1],
                longitude: data[i].geolocation.coordinates[0]
            },
            // console.log(tmp);
            points.push(tmp);
        }
    }

    var point = { latitude: 42.083333, longitude: 3.1 };
    var maxResults = 1;

    for (let i = 0; i < 50; i++) {
        /*
        geocoder.reverseGeocode( 42.083333, 3.1, function ( err, data ) {
            if (err) {
                throw err;
            }
            console.log(data);
          });
          */
        /*
        geocoder.lookUp(points[i], maxResults, function (err, res) {
            console.log(JSON.stringify(res, null, 2));
        });
        */
    }
    geocoder.lookUp(points, function (err, res) {
        if (err) {
            throw err;
        }
        console.log(JSON.stringify(res, null, 2));
        console.log('done');
    });
});