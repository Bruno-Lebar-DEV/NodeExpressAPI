import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';

describe('Auth - Login', () => {
  const testUser = {
    name: 'Login Test',
    email: 'login_test@email.com',
    password: 'Senha@123',
  };

  beforeAll(async () => {
    // Remove usuário de teste se já existir
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    // Cria usuário usando o modelo User (aplicando o hook de hash)
    const user = new User({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    });
    await user.save();
  });

  afterAll(async () => {
    // Remove usuário de teste após os testes
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve logar com sucesso', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('deve falhar com senha errada', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'errada' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar com email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@email.com', password: 'Senha@123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar com payload inválido (sem email)', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: testUser.password });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar com payload inválido (sem senha)', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('deve falhar ao logar com conta removida/desativada', async () => {
    // Remove o usuário (soft delete)
    await mongoose.connection
      .collection('users')
      .updateOne({ email: testUser.email }, { $set: { deleted: true } });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
    // Reativa para não impactar outros testes
    await mongoose.connection
      .collection('users')
      .updateOne({ email: testUser.email }, { $unset: { deleted: '' } });
  });
});
