const _ = require('lodash');
const cache = require('node-cache');

const shared = require('../shared');
const models = require('../services');

/** cache config */
const cacheTTL = 300; // time in seconds
const cacheRefresh = 120; // time in seconds
const departuresCache = new cache({ stdTTL: cacheTTL, checkperiod: cacheRefresh });

/** transform departures to have only required values */
const transformDepartures = departures =>
  _.filter(_.map(departures.services, service => ({
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
  })), departure =>
      // consider only train departures
      departure.type === 'TRAIN'
  );

/** retrieve departures for provided station */
const getTrainDeparturesByStationID = (req, res, next) => {
  // check if key present in cache first
  const stationId = req.params.stationId;
  departuresCache.get(stationId, (err, value) => {
    if (!err) {
      if (value === undefined) {
        // not cached, retrieve key and store
        models.departures.fetchById(stationId)
          .then((departures) => {
            /* valid response */
            if (departures.statusCode === 200) {
              const depList = JSON.parse(departures.body); // json
              const response = transformDepartures(depList);

              // set cache key
              departuresCache.set(stationId, response);

              res.json(response); // return valid list of departures
            } else {
              /* unexpected error from request */
              res.status(500).send({ errCode: '500', errMessage: 'Unexpected Error' });
            }
          }).catch(err => next(err));
        // key not found
      } else {
        // return cached value
        res.json(value);
      }
    }
  });
};

/** list of public methods */
module.exports = {
  getTrainDeparturesByStationID
};
