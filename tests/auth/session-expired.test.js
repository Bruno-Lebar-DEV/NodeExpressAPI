import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import app from '../../src/index.js';
import jwt from 'jsonwebtoken';

describe('Auth - Expiração de Sessão', () => {
  let expiredToken, userId;
  const testUser = {
    name: 'Expira Test',
    email: 'expira_test@email.com',
    password: 'Senha@123',
    role: 'visual',
  };

  beforeAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    const user = new User(testUser);
    await user.save();
    userId = user._id;
    // Token expirado (expira em 1 segundo no passado)
    expiredToken = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: -1 } // já expirado
    );
  });

  afterAll(async () => {
    await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
  });

  it('deve negar acesso com token expirado', async () => {
    const res = await request(app)
      .get('/api/users/')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/expirad/i);
  });
});
