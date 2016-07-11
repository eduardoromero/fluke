"use strict";

const dotenv = require('dotenv').config();
const _ = require('lodash');
const DocumentClient = require('documentdb').DocumentClient;

const db_host = process.env.DB_HOST;
const key = process.env.MASTERKEY;
const documents_url = process.env.DOCUMENT_URL;
const data_port = process.env.DATA_PORT;

const client = new DocumentClient(db_host, {masterKey: key});

const moment = require('moment-timezone');

const express = require('express');
var app = express();


app.get('/data', function (req, res) {
    client.queryDocuments(documents_url, "SELECT * FROM data").toArray(function (err, results) {
        let status = 'OK';
        if (err) {
            console.log(db_host, key, documents_url);
            console.dir(err);
            status = 'ERROR';
        }

        let num_results = results.length;
        let sum = _.reduce(results, function (sum, fluke) {
            return (sum + fluke.speed.download);
        }, 0);

        /* Mbps */
        let avg = (sum / num_results) * 8;

        let response = _.map(results, function (fluke) {
            /* timestamp, Mbps */
            var ts = moment(fluke.date);

            return [ parseInt(ts.tz('America/Mexico_City').format('x')), fluke.download * 8]
        });

        res.json({
            status: status,
            results: response,
            avg: avg,
            samples: num_results
        });
    });
});

app.use(express.static('static'));

app.listen(data_port, function () {
    console.log('Data app listening on port ' + data_port + '!');
});