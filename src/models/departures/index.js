'use strict';

const request = require('request-promise');

const endpoint = '/departures/';

/* get departures by station id */
var fetchById = (stationId) => {
    var options = {
        uri: process.env.TRAINLINE_URI + endpoint + stationId,
        resolveWithFullResponse: true
    };

    return request(options);
};

module.exports = {
    fetchById: fetchById
};
