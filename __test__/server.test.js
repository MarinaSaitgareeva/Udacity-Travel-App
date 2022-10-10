const supertest = require('supertest');
// Link to your server file
const app = require('../src/server/server');
const request = supertest(app);

// Test the server
it('', async () => {
  await request.get('/test')
      .expect(200)
      .then((response) =>
          expect(response.body.msg).toBe('Done!'))
});