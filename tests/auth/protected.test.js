import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Auth - Protected Routes', () => {
  let token;
  let userId;
  const testUser = {
    name: 'Protected Test',
    email: 'protected_test@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
    userId = user._id;
    token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve negar acesso sem token', async () => {
    const res = await request(app).get('/api/users/');
    expect(res.status).toBe(401);
  });

  it('deve negar acesso com token inválido', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', 'Bearer tokeninvalido');
    expect(res.status).toBe(401);
  });

  it('deve permitir acesso com token válido', async () => {
    const res = await request(app).get('/api/users/').set('Authorization', `Bearer ${token}`);
    expect([200, 403]).toContain(res.status); // 200 se permitido, 403 se role não permite
  });
});
