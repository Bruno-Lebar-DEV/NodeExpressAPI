import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index.js';

describe('Auth - Register', () => {
  const testUser = {
    name: 'Register Test',
    email: 'register_test@email.com',
    password: 'Senha@123',
  };

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body).toHaveProperty('token');
  });

  it('deve falhar ao registrar usuário já existente', async () => {
    await request(app).post('/api/auth/register').send(testUser); // Cria o usuário
    const res = await request(app).post('/api/auth/register').send(testUser); // Tenta criar novamente
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar ao registrar com campos obrigatórios ausentes', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'faltando@email.com', password: 'Senha@123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar ao registrar com senha fraca', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Fraca', email: 'fraca@email.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar ao registrar com email inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Email Inválido', email: 'invalido', password: 'Senha@123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
