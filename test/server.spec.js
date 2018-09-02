const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('site', () => {        
    it('Should have home page', (done) => { 
        chai.request('localhost:4200')
            .get('/')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                res.status.should.be.equal(200);
                done();                      
            });
    });
});