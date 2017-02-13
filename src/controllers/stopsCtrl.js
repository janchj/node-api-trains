 'use strict';

const _ = require('lodash');

/** cache config */
const cache = require('node-cache');
const cacheTTL = 300; // time in seconds
const cacheRefresh = 120; // time in seconds
const stopsCache = new cache( { stdTTL: cacheTTL, checkperiod: cacheRefresh } );

const shared = require('../shared');
const models = require('../models');

/** retrieve stops for provided departure and time */
var getTrainStopsByDepartureId = (req, res, next) => {

    // check if key present in cache first
    let departureId = req.params.departureId;
    let date = req.params.date;
    stopsCache.get(date + departureId, function( err, value ){
        if(!err){
            if(value == undefined) {
                // not cached, retrieve key and store
                models.stops.fetchById(req.params.departureId, req.params.date)
                    .then((stops) => {
                        /* valid response */
                        if (stops.statusCode == 200) {
                            let stopsList = JSON.parse(stops.body) || {} ; // json
                            let response = transformStops(stopsList)

                            // set cache key
                            stopsCache.set(date + departureId, response);

                            res.json(response); // return valid list of departures
                        }
                        else{
                            /* unexpected error from request */
                            res.status(500).send({ errCode: '500', errMessage: 'Unexpected Error' });
                        }
                    }).catch((err) =>{
                        return next(err);
                });
            } else{ // key not found 
                // return cached value
                res.json(value);
            }
        }
    });
};

/** transform stops to have only required values */
var transformStops = function(stops){
    return _.map(stops.service.stops, function(stop){
        return {
            timestamp: getStopTime(stop),
            operator: {
                operatorId: stops.service.serviceOperator,
                name: shared.getOperatorName(stops.service.serviceOperator)
            },
            station: {
                stationId: stop.location.crs,
                name: shared.getStationName(stop.location.crs)
            },
            platform: getStopPlatform(stop),
            onTime: isStopOnTime(stop)
        };
    });
};

/** checks if an arrival stop */
var isArrival = (stop) => {
    return stop.departure.notApplicable;
};

/** gets the stop time, if unclear assumes empty */
var getStopTime = (stop) => {
    let stopInfo;

    // if not departure, then arrival
    if(isArrival(stop)) {
        stopInfo = stop.arrival;
    }
    else {
        stopInfo = stop.departure; // assume departure
    }

    // validate if platform is provided
    if(stopInfo.realTime
        && stopInfo.realTime.realTimeServiceInfo
        && stopInfo.realTime.realTimeServiceInfo.realTime)
        return stopInfo.realTime.realTimeServiceInfo.realTime;
    return '';
};

/** gets the stop platform, if unclear assumes empty */
var getStopPlatform = (stop)=>{
    let stopInfo;

    // if not departure, then arrival
    if(isArrival(stop)) {
        stopInfo = stop.arrival;
    }
    else {
        stopInfo = stop.departure; // assume departure
    }

    // validate if platform is provided
    if(stopInfo.realTime
        && stopInfo.realTime.realTimeServiceInfo
        && stopInfo.realTime.realTimeServiceInfo.realTimePlatform)
        return stopInfo.realTime.realTimeServiceInfo.realTimePlatform;
    return '';
};

/** checks if the stop is on time, if unclear assumes on time */
var isStopOnTime = (stop)=>{
    let stopInfo;

    // if not departure, then arrival
    if(isArrival(stop)) {
        stopInfo = stop.arrival;
    }
    else {
        stopInfo = stop.departure; // assume departure
    }

    // validate if departure is on time
    if(stopInfo.realTime
        && stopInfo.realTime.realTimeServiceInfo
        && stopInfo.realTime.realTimeServiceInfo.realTimeFlag)
        return (stopInfo.realTime.realTimeServiceInfo.realTimeFlag!='Delayed');
    return true;
};

/** list of public methods */
module.exports = {
    getTrainStopsByDepartureId: getTrainStopsByDepartureId
};
