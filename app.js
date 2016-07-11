"use strict";

const dotenv = require('dotenv').config();

const DocumentClient = require('documentdb').DocumentClient;
const speedTest = require('speedtest-net');
const later = require('later');

const servers = [ 1945, 3501, 6836, 2409, 6000, 7189, 4043, 1763, 6600, 7340];

const db_host = process.env.DB_HOST;
const key = process.env.MASTERKEY;
const documents_url = process.env.DOCUMENT_URL || 'dbs/flukes/colls/data';

const client = new DocumentClient(db_host, {masterKey: key});


let config;
config = {
    maxTime: 500,
    log: true,
    serverId: process.env.SERVER_ID || servers[Math.floor( Math.random() * servers.length )] /* random server */
};

let results = [];

const schedule = later.parse.text('every 1 minutes');
const scheduler = later.setInterval(function() {
    /* print the date */
    console.log(new Date());

    /* start the testing */
    let tester = speedTest(config);

    /* randomize server again, unless is specified */
    config.serverId = process.env.SERVER_ID || servers[Math.floor( Math.random() * servers.length )];

    tester.on('data', function(data) {
        let fluke = {
            download: data.speeds.download,
            upload: data.speeds.upload,
            server: data.server,
            speed: data.speeds,
            date: new Date()
        };

        client.createDocument(documents_url, fluke, function(err, doc) {
            if(err) {
                console.log('error ->', err);
            }
        });

        console.log('Testing with: ' + data.server.location + ' ' + data.server.sponsor + ' (' + data.server.id + ')');
        console.log('Test results - ' + data.speeds.download + ' mbps / ' + data.speeds.upload + ' mbps');
    });

    tester.on('error', function(err) {
        console.error(err);
    });

    tester.on('result', function(url) {
        if (!url) {
            console.log('Could not successfully post test results.');
        } else {
            console.log('Test result url:', url);
        }
    });

    tester.on('done', function(data) {
        // console.log('TL;DR:');
        // console.dir(data);
        // console.log('The speed test has completed successfully.');


    });
}, schedule);

/* trigger the first one so we don't have to wait one interval */
later.schedule(schedule).next();