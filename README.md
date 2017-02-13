## Wrapper for trainline's API and expose departures and stops based on stations.
Responses tailored based on required data to be exposes.
For API documentation, please run application and browse /docs.

## Stack
* Hackaton boilerplate (https://github.com/sahat/hackathon-starter) - Starting point.
* Swagger (https://github.com/swagger-api/swagger.io) - API documentation.
* Express (https://github.com/expressjs/express) - Serving the http requests.
* Node-cache - Used to cache responses from external API.
* Mocha + chai + nock - Testing stack.
* Winston - Logging.
* Helmet - HTTP Security best practices.
* NSG - Package vulnerability checks.

## Data
* Operators data taken from: http://wiki.openraildata.com/index.php/TOC_Codes
* Stations data taken from http://www.nationalrail.co.uk/stations_destinations/48541.aspx

## Questions

* How do you manage configuration - we have a development version of the realtime API we should use for CI builds.
There might be a better way to handle this, but at the moment, I used a package (dotenv) to store all the dev environment keys.

* How do you manage node process when the service is deployed.
I've used in the past PM2 to run the application in production. It gives some really nice 'view' of the service and the environment
where is running. It can also be extended with additional modules to handle logging and monitor server resources. Additionally to that,
a build processor (gulp/grunt) would be added to 'build' the files.

* How might you document the endpoints?
I tend to lean towards frictionless documentation as constant updating is required and is easy to set as a 'low-priority' task even though is not.
For that reason, I like using swagger-api (http://swagger.io) that allows me to 'mock' how the endpoints are going to 'look' without much effort and allows a nice looking documentation to be generated and more importantly, up to date.

* As a developer, how can I be made aware of an error for a given request and be in a position to investigate it?
Using winston to log errors including the stack data. Remote logging should be used for production (can be easily added), although at the moment, only console logging enabled.
Can be quite handy if using monitoring tools like pm2, where the logging data will be visible via their web console. As an additional step (never done it before, but on my list)
will be great to 'hook' the errors to slack, so team-members would be notified if any issues occured.

## Things I am thinking about as missing/enhancements
* Authentication, using any existing oauth server and auth0/passport.
* Expose additional endpoints (operators? stations?)
* Use firebase or remote data source to store lookup values, to have dynamic lookup models.
* Caching, with more 'accurate', to speed things up.
* additional remote logging, possibly using an external service like papertrail.

## Run
* npm install
* npm run