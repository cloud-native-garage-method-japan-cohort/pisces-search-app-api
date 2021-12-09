const chai = require('chai');
const request = require('supertest');
const should = chai.should();
const app = require('../../app');

describe('POST /search', () => {
  it('should return output text', async () => {
    // const res = await request(app)
    //     .post('/search')
    //     .send({
    //       text: 'コロナ',
    //       type: 1,
    //       item_num: 4
    //     });

    // res.status.should.equal(200);
    // console.log(res.body.data);
    // should.exist(res.body.data);
  });
});
