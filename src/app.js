/**
 * Module dependencies.
 */
const express = require('express');
const swaggerTools = require('swagger-tools');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const helmet = require('helmet')
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const winston = require('winston');
const expressWinston = require('express-winston');

/** * Controllers (route handlers) */
const controllers = require('./controllers');

/** Load environment variables from .env file, where API keys and passwords are configured. */
require('dotenv').config();

/** create Express server */
const app = express();

/** express configuration */
app.set('port', process.env.PORT || 3000);
app.use(expressStatusMonitor());
app.use(compression());
app.use(bodyParser.json());

app.use(expressValidator());
app.use(flash());

/** security configuration */
app.use(helmet());

/** swagger configuration */
var swaggerDoc = require('./swagger.json');

swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

// logging
expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
}));

/** routes */
app.get('/traindepartures/:stationId', controllers.departures.getTrainDeparturesByStationID);
app.get('/stops/:departureId/:date', controllers.stops.getTrainStopsByDepartureId);

/** error handler */
app.use(function(err, req, res, next) {
  if(err){
    res.status(err.statusCode || 500);
    let errorBody = err.error || {}
    res.json(JSON.parse(errorBody));
  }
  next();
});

// express-winston errorLogger
app.use(expressWinston.errorLogger({
  dumpExceptions: true,
  showStack: true,
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

/** launch server */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
