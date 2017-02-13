'use strict';

const fsp = require('fs-promise');
const path = require('path');
const operators = require('./operators-data.json');

/* get all operators */
var all = () => {
    return operators;
};

module.exports = {
    all: all
};
