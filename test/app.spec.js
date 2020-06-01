'use strict';
/* global request */

const app = require('../src/app');


describe('Generic route tests', () => {
 
  it('rejects unauthorized user', () => {
    return request(app)
      .get('/')
      .status(401);
  });

  it('Responds to homepage request', () => {
    return request(app)
      .get('/')
      .set('Authorization', 'a abcde')
      .expect(200, 'Hello, Noteful!');
  });

  it('Handles invalid request', () => {
    return request(app)
      .get('/l')
      .set('Authorization', 'a abcde')
      .status(404);
  });
});
