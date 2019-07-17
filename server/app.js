const express = require('express');
const fs = require('fs');
const csv=require('csvtojson');
const app = express();

var newEntry = [];

app.use((req, res, next) => {
    var getUserAgent = req.get('User-Agent');
    var userAgent = getUserAgent;
    newEntry.push(userAgent);

    var dateTime = new Date().toISOString();
    newEntry.push(dateTime);

    var httpMethod = req.method;
    newEntry.push(httpMethod);

    var resource = req.url;
    newEntry.push(resource);

    var version = req.httpVersion;
    newEntry.push('HTTP/' + version);

    var status = res.statusCode;
    newEntry.push(status);

    var newJoin = newEntry.join(',');
    var otherNew = `\n${newJoin}`

    console.log(otherNew);

    fs.appendFile('tmp/log.csv', otherNew, (err) => {
        if (err) throw err;
    });

    newEntry = [];
    next();
});

app.get('/', (req, res) => {
    res.status(200).send('Okay');
});

app.get('/logs', (req, res) => {
    const csvFilePath= 'tmp/log.csv';
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            res.status(200).send(jsonObj);
        })
});

module.exports = app;