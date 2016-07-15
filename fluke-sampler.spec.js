'use strict';
let test = require('blue-tape');
let FlukeSampler = require('./fluke-sampler.js');
let FlukeApp = new FlukeSampler();


test('FlukeApp => FlukeSampler', (assert) => {

    assert.is(FlukeApp.constructor.name, 'FlukeSampler', 'FlukeSampler is our base class.');

    let test_servers = [1945, 3501, 6836, 2409, 6000, 7189, 4043, 1763, 6600, 1335, 5827, 4047, 5978];

    assert.same(FlukeApp.servers, test_servers, 'We do have our base servers defined.');

    /* check we have a test server defined */
    assert.ok(FlukeApp.server, 'We do have a selected server to start testing with.');

    /* check we have cat set a test server */
    let test_server = test_servers[Math.floor(Math.random() * test_servers.length)];
    assert.is(FlukeApp.next_server(test_server), test_server, "We do have a random test server.");

    assert.end();
});

test('FlukeApp => Start / Stop', (assert) => {
    assert.is(FlukeApp.status, 'stopped', 'Fluke App hasnt started.');

    FlukeApp.start();
    assert.is(FlukeApp.status, 'started', 'Fluke App Started.');

    FlukeApp.stop();
    assert.is(FlukeApp.status, 'stopped', 'Fluke App Started.');

    assert.end();
});


test('FlukeApp => Run fluke (two download tests, hence Async).', (assert) => {

    FlukeApp.start();

    let test_counter = 0;

    FlukeApp.events.on('ran', function (data) {
        test_counter++;

        assert.comment("Fluke App is running...");
        assert.pass("Download test ran ("+ test_counter +").");

        if(process.env.DEBUG) {
            /* when testing it just returns the fluke object */
            assert.comment("Download speed clocked " + data.download+ " mbps");
            assert.comment("Reported user " + data.uid);
        } else {
            /* else it returns promise from DocumentDB createDocumentAsync() object */
            data.then(function(response) {
                let data = response.resource;

                assert.comment("Download speed clocked " + data.download+ " mbps");
                assert.comment("Reported user " + data.uid);
            });
        }

        if(test_counter >= 2) {
            FlukeApp.stop();
            assert.end();
        }
    });
});