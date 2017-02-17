## Wrapper for trainline's API to expose departure information.
Responses tailored based on required data to be exposed.
* For API documentation, please run application and browse /docs.

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

## Next?
* Authentication, using any existing oauth server and auth0/passport.
* Expose additional endpoints (operators? stations?)
* Use firebase or remote data source to store lookup values, to have dynamic lookup models.
* External caching, with more 'accurate' expiration, to speed things up, possibly using redis.
* Additional remote logging, possibly using an external service like papertrail.
* Add hosting with heroku?

## Run
* npm install
* npm run (default: http://localhost:3000)
* npm test

## Docs
* Run and navigate to path '/docs' (default: http://localhost:3000/docs)
