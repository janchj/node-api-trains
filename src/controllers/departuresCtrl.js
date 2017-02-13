 'use strict';

const _ = require('lodash');

/** cache config */
const cache = require('node-cache');
const cacheTTL = 300; // time in seconds
const cacheRefresh = 120; // time in seconds
const departuresCache = new cache( { stdTTL: cacheTTL, checkperiod: cacheRefresh } );

const shared = require('../shared');
const models = require('../models');

/** retrieve departures for provided station */
var getTrainDeparturesByStationID = (req, res, next) => {

    // check if key present in cache first
    let stationId = req.params.stationId;
    departuresCache.get(stationId, function( err, value ){
        if(!err){
            if(value == undefined) {
                // not cached, retrieve key and store
                models.departures.fetchById(stationId)
                    .then((departures) => {
                        /* valid response */
                        if (departures.statusCode == 200) {
                            let depList = JSON.parse(departures.body); // json
                            let response = transformDepartures(depList);

                            // set cache key
                            departuresCache.set(stationId, response);

                            res.json(response); // return valid list of departures
                        }
                        else{
                        /* unexpected error from request */
                        res.status(500).send({ errCode: '500', errMessage: 'Unexpected Error' });
                        }
                    }).catch((err) =>{
                        return next(err);
                });
            // key not found 
            } else{
                // return cached value
                res.json(value);
            }
        }
    });


};

/** transform departures to have only required values */
var transformDepartures = function(departures){
    return _.filter(_.map(departures.services, function(service){
        return {
            timestamp: service.scheduledInfo.scheduledTime,
            departureId: service.serviceIdentifier,
            operator: {
                operatorId: service.serviceOperator,
                name: shared.getOperatorName(service.serviceOperator)
            },
            destination: {
                stationId: service.destinationList[0].crs,
                name: shared.getStationName(service.destinationList[0].crs)
            },
            platform: shared.getDeparturePlatform(service),
            onTime: shared.isDepartureOnTime(service),
            type: service.transportMode
        };
    }),function(departure) {
        // consider only train departures
        return departure.type === 'TRAIN'
    });
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
        return (departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimeFlag!='delayed');
    return true;
};

/** list of public methods */
module.exports = {
    getTrainDeparturesByStationID: getTrainDeparturesByStationID
};
