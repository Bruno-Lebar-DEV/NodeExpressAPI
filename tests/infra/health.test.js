import request from 'supertest';
import app from '../../src/index.js';
import mongoose from 'mongoose';

describe('Healthcheck', () => {
  it('deve retornar status ok e db ok se tudo estiver funcionando', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('ok');
  });

  it('deve retornar db unavailable se conexão do mongoose não estiver aberta', async () => {
    // Simula desconexão
    const originalState = mongoose.connection.readyState;
    mongoose.connection.readyState = 0;
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body.db).toBe('unavailable');
    // Restaura estado
    mongoose.connection.readyState = originalState;
  });
});
