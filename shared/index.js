const _ = require('lodash');

const models = require('../services');

/** lookup the stationId for the name */
const getStationName = (stationId) => {
  const stations = models.stations;
  const stationObj = _.map(_.filter(stations, { stationId }), 'name');
  if (stationObj[0]) {
    return stationObj[0];
  }
  return '';
};

/** lookup the operatorId for the name */
const getOperatorName = (operatorId) => {
  const operators = models.operators;
  const operatorObj = _.map(_.filter(operators, { operatorId }), 'name');
  if (operatorObj[0]) {
    return operatorObj[0];
  }
  return '';
};

/** gets the departure platform, if unclear assumes empty */
const getDeparturePlatform = (departure) => {
  // validate if platform is provided
  if (departure.realTimeUpdatesInfo
    && departure.realTimeUpdatesInfo.realTimeServiceInfo
    && departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform) {
    return departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimePlatform;
  }
  return '';
};

/** checks if the departure is on time, if unclear assumes on time */
const isDepartureOnTime = (departure) => {
  // validate if departure is on time
  if (departure.realTimeUpdatesInfo
    && departure.realTimeUpdatesInfo.realTimeServiceInfo
    && departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimeFlag) {
    return (departure.realTimeUpdatesInfo.realTimeServiceInfo.realTimeFlag !== 'Delayed');
  }
  return true;
};

module.exports = {
  getStationName,
  getOperatorName,
  getDeparturePlatform,
  isDepartureOnTime
};
