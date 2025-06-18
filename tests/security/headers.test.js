import request from 'supertest';
import app from '../../src/index.js';

describe('Security - Headers', () => {
  it('deve conter headers de segurança', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['x-content-type-options']).toBeDefined();
    expect(res.headers['strict-transport-security']).toBeDefined();
  });
});
