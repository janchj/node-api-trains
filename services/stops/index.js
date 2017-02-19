'use strict';

const request = require('request-promise');

const endpoint = '/callingPattern/';

/* get stops by departure id and date*/
var fetchById = (departureId, date) => {
    var options = {
        uri: process.env.TRAINLINE_URI + endpoint + departureId + '/' + date,
        resolveWithFullResponse: true
    };

    return request(options);
};

module.exports = {
    fetchById: fetchById
};
