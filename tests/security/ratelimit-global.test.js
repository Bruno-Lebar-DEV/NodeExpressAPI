import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Security - Rate Limit Global', () => {
  let token;
  const testUser = {
    name: 'Rate Limit Test',
    email: 'ratelimit_test@email.com',
    password: 'Senha@123',
    role: 'admin',
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

  it('deve bloquear requisições após atingir o rate limit global', async () => {
    let lastRes;
    const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX, 10) + 20 || 50 + 10;
    for (let i = 0; i < rateLimitMax; i++) {
      lastRes = await request(app).get('/api/users/').set('Authorization', `Bearer ${token}`);
    }
    expect(lastRes.status).toBe(429);
    expect(lastRes.body.message).toMatch(/muitas/i);
  }, 20000); // aumenta o timeout para 20 segundos
});
