 'use strict';

const models = require('../models');
const _ = require('lodash');

/** lookup the stationId for the name */
var getStationName = (stationId) =>{
    var stations = models.stations.all();
    var stationObj = _.map(_.filter(stations, {stationId: stationId}),'name');
    if(stationObj[0]) return stationObj[0];
    else return '';
};

/** lookup the operatorId for the name */
var getOperatorName = (operatorId) =>{
    var operators = models.operators.all();
    var operatorObj = _.map(_.filter(operators, {operatorId: operatorId}),'name');
    if(operatorObj[0]) return operatorObj[0];
    else return '';
};

/** gets the departure platform, if unclear assumes empty */
var getDeparturePlatform = (departure)=>{
    // validate if platform is provided
    if(departure.realTimeUpdatesInfo
        && departure.realTimeUpdatesInfo.realTimeServiceInfo
        && departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform)
        return departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform;
    return '';
};

/** checks if the departure is on time, if unclear assumes on time */
var isDepartureOnTime = (departure)=>{
    // validate if departure is on time
    if(departure.realTimeUpdatesInfo
        && departure.realTimeUpdatesInfo.realTimeServiceInfo
        && departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimeFlag)
        return (departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimeFlag!='Delayed');
    return true;
};

module.exports = {
    getStationName: getStationName,
    getOperatorName: getOperatorName,
    getDeparturePlatform: getDeparturePlatform,
    isDepartureOnTime: isDepartureOnTime
}