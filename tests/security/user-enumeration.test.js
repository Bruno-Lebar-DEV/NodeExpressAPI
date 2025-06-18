import request from 'supertest';
import app from '../../src/index.js';

describe('Security - User Enumeration', () => {
  it('deve retornar mensagem genérica para login com email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@email.com', password: 'Senha@123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/inválido|incorreto|genéric/i);
  });
});
