import request from 'supertest';
import app from '../../src/index.js';

describe('Security - Content-Type', () => {
  it('deve rejeitar requisições sem Content-Type em endpoints que exigem JSON', async () => {
    const res = await request(app).post('/api/tasks/').set('Content-Type', '').send('title=Teste');
    expect([400, 401]).toContain(res.status);
  });
});
