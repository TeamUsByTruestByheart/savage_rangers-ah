import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import statuses from '../src/helpers/constants/status.codes';

const { expect } = chai;
chai.use(chaiHttp);

describe('testing the signout controller', () => {
  it('should check for an empty token and alert that the user is unauthorized', (done) => {
    chai
      .request(app)
      .get('/api/users/signout')
      .set('Authorization', 'asdfafcad')
      .end((err, res) => {
        expect(res.body).to.have.status(statuses.UNAUTHORIZED);
        expect(res.body)
          .to.have.property('message')
          .eql('Forbiden access');
        done();
      });
  });
});
