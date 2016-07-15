"use strict";

const dotenv = require('dotenv').config();

const DocumentClient = require('documentdb-q-promises').DocumentClientWrapper;
const speedTest = require('speedtest-net');
const later = require('later');
const EventEmitter = require('events');

class FlukeSampler {

    constructor(servers, schedule) {
        this._schedule = later.parse.text(schedule || 'every 1 minutes');
        this._servers = [1945, 3501, 6836, 2409, 6000, 7189, 4043, 1763, 6600, 1335, 5827, 4047, 5978];
        this._results = [];

        this._config = {
            maxTime: 500,
            log: true,
            serverId: this._servers[0]
        };

        this.next_server();


        this._documents_url = process.env.DOCUMENT_URL || 'dbs/flukes/colls/data';
        this._status = 'stopped';

        this.events = new EventEmitter();
    }

    stop() {
        this._scheduler.clear();

        this._status = 'stopped';
    }

    start() {
        this._status = 'started';

        this._scheduler = later.setInterval(() => {
            /* print the date */
            console.log(new Date());


            /* start the testing */
            let tester = new speedTest(this._config);

            this._current_tester = tester;
            this._status = 'running';

            /* randomize next server */
            this.next_server();

            tester.on('data', (data) => {
                let fluke = {
                    download: data.speeds.download,
                    upload: data.speeds.upload,
                    server: data.server,
                    speed: data.speeds,
                    date: new Date(),
                    uid: process.env.USER,
                    location: process.env.LOCATION
                };

                console.log('Testing with: ' + data.server.location + ' ' + data.server.sponsor + ' (' + data.server.id + ')');
                console.log('Test results - ' + data.speeds.download + ' mbps / ' + data.speeds.upload + ' mbps');

                this.events.emit('ran', this.save_fluke(fluke));
            });

            tester.on('error', (err) => {
                this.events.emit('error', err);
            });

            tester.on('result', function (url) {
                if (!url) {
                    console.log('Could not successfully post test results.');
                } else {
                    console.log('Test result url:', url);
                }
            });

            tester.on('done', (data) => {
                // console.log('TL;DR:');
                // console.dir(data);
                // console.log('The speed test has completed successfully.');
            });

        }, this._schedule);
    }

    save_fluke(fluke) {
        const db_host = process.env.DB_HOST;
        const key = process.env.MASTERKEY;

        const client = new DocumentClient(db_host, {masterKey: key});

        if(process.env.DEBUG) {
            return fluke;
        } else {
            return client.createDocumentAsync(this._documents_url, fluke);
        }
    }

    next_server(server) {
        this._config.serverId = server || process.env.SERVER_ID || this._servers[Math.floor(Math.random() * this._servers.length)];
        return this._config.serverId;
    }

    get tester() {
        return this._current_tester;
    }

    get status() {
        return this._status
    };

    get server() {
        return this._config.serverId;
    }

    get servers() {
        return this._servers;
    }

    get results() {
        return this._results;
    }

    get config() {
        return this._config;
    }
}

module.exports = FlukeSampler;