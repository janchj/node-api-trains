'use strict';

const fsp = require('fs-promise');
const path = require('path');
const stations = require('./stations-data.json');

/* get all stations */
var all = () => {
    return stations;
};

module.exports = {
    all: all
};
