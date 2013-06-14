var fs = require('fs');

var Firebase = require('firebase')
  , myRootRef = new Firebase('https://26globe.firebaseIO.com')
  , fireGlobe = myRootRef.child('updateRequest').child('1');

var express = require('express')
  , http = require('http')
  , app = express();


var buckets = [];

var updateFireGlobe = function () {
  fireGlobe.set(buckets);
};

var resetBuckets = function (req, res) {
  fs.readFile('./initialRequest.json',{},function (err, data) {
    if (err) throw err;
    buckets = JSON.parse(data)[1];
    // console.log(JSON.parse(data)[0]);
    console.log('done');

    for (var i = 0, l = buckets.length; i < l; i += 3) {
      buckets[i + 2] = 0.01;
    }

    updateFireGlobe();
    res.end('resetted');
  });
};

var updateBuckets = function (req, res) {
  fs.readFile('./initialRequest.json',{},function (err, data) {
    if (err) throw err;
    buckets = JSON.parse(data)[1];
    // console.log(JSON.parse(data)[0]);
    console.log('done');
    // for (var i = 0, l = buckets.length; i < l; i += 3) {
    //   buckets[i + 2] = 0.01;
    // }

    updateFireGlobe();
    res.end('updated');
  });
};


// pull stats
// update bucket info


app.get('/reset', resetBuckets);
app.get('/update', updateBuckets);
http.createServer(app).listen(5000);
