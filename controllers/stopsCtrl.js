const _ = require('lodash');
const Cache = require('node-cache');

const shared = require('../shared');
const services = require('../services');

/** cache config */
const cacheTTL = 300; // time in seconds
const cacheRefresh = 120; // time in seconds
const stopsCache = new Cache({ stdTTL: cacheTTL, checkperiod: cacheRefresh });

/** checks if an arrival stop */
const isArrival = stop => stop.departure.notApplicable;

/** gets the stop time, if unclear assumes empty */
const getStopTime = (stop) => {
  let stopInfo;

  // if not departure, then arrival
  if (isArrival(stop)) {
    stopInfo = stop.arrival;
  } else {
    stopInfo = stop.departure; // assume departure
  }

  // validate if platform is provided
  if (stopInfo.realTime
    && stopInfo.realTime.realTimeServiceInfo
    && stopInfo.realTime.realTimeServiceInfo.realTime) {
    return stopInfo.realTime.realTimeServiceInfo.realTime;
  }
  return '';
};

/** gets the stop platform, if unclear assumes empty */
const getStopPlatform = (stop) => {
  let stopInfo;

  // if not departure, then arrival
  if (isArrival(stop)) {
    stopInfo = stop.arrival;
  } else {
    stopInfo = stop.departure; // assume departure
  }

  // validate if platform is provided
  if (stopInfo.realTime
    && stopInfo.realTime.realTimeServiceInfo
    && stopInfo.realTime.realTimeServiceInfo.realTimePlatform) {
    return stopInfo.realTime.realTimeServiceInfo.realTimePlatform;
  }
  return '';
};

/** checks if the stop is on time, if unclear assumes on time */
const isStopOnTime = (stop) => {
  let stopInfo;

  // if not departure, then arrival
  if (isArrival(stop)) {
    stopInfo = stop.arrival;
  } else {
    stopInfo = stop.departure; // assume departure
  }

  // validate if departure is on time
  if (stopInfo.realTime
    && stopInfo.realTime.realTimeServiceInfo
    && stopInfo.realTime.realTimeServiceInfo.realTimeFlag) {
    return (stopInfo.realTime.realTimeServiceInfo.realTimeFlag !== 'Delayed');
  }
  return true;
};

/** transform stops to have only required values */
const transformStops = stops =>
  _.map(stops.service.stops, stop => ({
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
  }));

/** retrieve stops for provided departure and time */
const getTrainStopsByDepartureId = (req, res, next) => {
  // check if key present in cache first
  const departureId = req.params.departureId;
  const date = req.params.date;
  stopsCache.get(date + departureId, (err, value) => {
    if (!err) {
      if (value === undefined) {
        // not cached, retrieve key and store
        services.stops.fetchById(req.params.departureId, req.params.date)
          .then((stops) => {
            /* valid response */
            if (stops.statusCode === 200) {
              const stopsList = JSON.parse(stops.body) || {}; // json
              const response = transformStops(stopsList);

              // set cache key
              stopsCache.set(date + departureId, response);

              res.json(response); // return valid list of departures
            } else {
              /* unexpected error from request */
              res.status(500).send({ errCode: '500', errMessage: 'Unexpected Error' });
            }
          }).catch(err => next(err));
      } else { // key not found
        // return cached value
        res.json(value);
      }
    }
  });
};

/** list of public methods */
module.exports = {
  getTrainStopsByDepartureId
};
