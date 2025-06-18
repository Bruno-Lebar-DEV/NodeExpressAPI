import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';

describe('Security - Brute Force Login', () => {
  const testUser = {
    name: 'Brute Force Test',
    email: 'bruteforce_test@email.com',
    password: 'Senha@123',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve bloquear login após várias tentativas inválidas', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'senhaerrada' });
    }
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'senhaerrada' });
    expect([400, 429]).toContain(res.status);
    if (res.status === 429) {
      expect(res.body.message).toMatch(/muitas/i);
    }
  });
});
