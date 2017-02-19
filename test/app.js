const request = require('supertest');
const nock = require('nock');

const app = require('../app.js');

/* load mock files */
const departuresLocalMock = require('./departures-local-mock.json');
const departuresRemoteMock = require('./departures-remote-mock.json');
const stopsRemoteMock = require('./stops-remote-mock.json');
const stopsLocalMock = require('./stops-local-mock.json');

describe('GET /traindepartures/{stationId}', () => {

  nock(process.env.TRAINLINE_URI)
    .get('/departures/stationId')
    .reply(200, departuresRemoteMock);

  it('missing stationId should return 404 BadRequest', (done) => {
    request(app)
      .get('/traindepartures/')
      .expect(404)
      .end(done);
  });

  it('valid stationId should return 200 Success', (done) => {
    request(app)
      .get('/traindepartures/stationId')
      .expect(200)
      .expect(departuresLocalMock)
      .end(done);
  });

});

describe('GET /stops/{departureId}/{date}', () => {

  nock(process.env.TRAINLINE_URI)
    .get('/callingPattern/departureId/date')
    .reply(200, stopsRemoteMock);

  it('missing departureId and date should return 404', (done) => {
    request(app)
      .get('/stops/')
      .expect(404)
      .end(done);
  });

  it('missing departureId should return 404', (done) => {
    request(app)
      .get('/stops/date')
      .expect(404)
      .end(done);
  });

  it('missing date should return 404', (done) => {
    request(app)
      .get('/stops/departureId')
      .expect(404)
      .end(done);
  });

  it('valid departureId and date should return 200 Success', (done) => {
    request(app)
      .get('/stops/departureId/date')
      .expect(200)
      .expect(stopsLocalMock)
      .end(done);
  });

});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/random-url')
      .expect(404, done);
  });
});
