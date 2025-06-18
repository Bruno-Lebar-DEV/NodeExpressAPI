import request from 'supertest';
import app from '../../src/index.js';

describe('Security - HTTP Methods', () => {
  it('deve retornar 404 ou 405 para método não permitido', async () => {
    const res = await request(app).patch('/api/tasks/').send({});
    expect([404, 405]).toContain(res.status);
  });
});
