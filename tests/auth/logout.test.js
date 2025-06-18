import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Auth - Logout', () => {
  let token;
  const testUser = {
    name: 'Logout Test',
    email: 'logout_test@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
    token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve realizar logout com sucesso', async () => {
    const res = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logout/i);
  });

  it('deve permitir logout mesmo sem token (stateless)', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/logout/i);
  });

  it('deve retornar erro ao tentar logout com payload no body', async () => {
    const res = await request(app).post('/api/auth/logout').send({ qualquer: 'coisa' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Não é permitido enviar payload no logout');
  });
});
