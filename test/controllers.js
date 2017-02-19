const expect = require('chai').expect;
const nock = require('nock');

const controllers = require('../controllers');
const departuresRemoteMock = require('./departures-remote-mock.json');

describe('departuresCtrl', () => {
  // create an invalid request object
  const req = {
    params: {
      stationId: ''
    }
  };

    nock(process.env.TRAINLINE_URI)
    .get('/departures/stationId')
    .reply(200, departuresRemoteMock);

  it('missing stationId should return 400-BadRequest', (done) => {
    controllers.departures.getTrainDeparturesByStationID(req, res, () => {
      console.log(res);
      expect(res.statusCode === '401');
    });
    done();
  });

});
