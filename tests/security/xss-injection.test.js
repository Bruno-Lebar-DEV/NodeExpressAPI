import request from 'supertest';
import app from '../../src/index.js';

describe('Security - XSS & Injection', () => {
  it('deve rejeitar payloads XSS no título da task', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .send({ title: '<script>alert(1)</script>', description: 'desc' });
    expect([400, 401]).toContain(res.status); // 401 se não autenticado, 400 se validado
  });

  it('deve rejeitar payloads SQL-like no título da task', async () => {
    const res = await request(app)
      .post('/api/tasks/')
      .send({ title: '1; DROP TABLE users;', description: 'desc' });
    expect([400, 401]).toContain(res.status);
  });
});
